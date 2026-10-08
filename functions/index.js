const { getApp, initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineSecret, defineString } = require('firebase-functions/params');
const nodemailer = require('nodemailer');

initializeApp();

const region = 'us-east1';
const databaseId = defineString('FIRESTORE_DATABASE_ID', {
  default: 'ai-studio-97ab00f1-ab02-4e36-8887-14a08a4fb075'
});
const smtpHost = defineString('SMTP_HOST');
const smtpPort = defineString('SMTP_PORT', { default: '587' });
const smtpUser = defineString('SMTP_USER');
const smtpPassword = defineSecret('SMTP_PASSWORD');
const publicAppUrl = defineString('PUBLIC_APP_URL');
const ownerEmail = 'naviora.pvt@gmail.com';
const companyInquiryEmail = defineString('COMPANY_INQUIRY_EMAIL', {
  default: 'naviora.pvt@gmail.com'
});
const db = getFirestore(getApp(), databaseId.value());
const auth = getAuth();

function mailTransport() {
  const port = Number(smtpPort.value());
  return nodemailer.createTransport({
    host: smtpHost.value(),
    port,
    secure: port === 465,
    auth: {
      user: smtpUser.value(),
      pass: smtpPassword.value()
    }
  });
}

async function requireAdmin(request) {
  const identity = request.auth;
  const email = identity?.token.email;
  if (!identity || !email || identity.token.email_verified !== true) {
    throw new HttpsError('unauthenticated', 'Sign in with an authorized Google account.');
  }

  const normalizedEmail = email.toLowerCase();
  const isOwner = normalizedEmail === ownerEmail && identity.token.firebase?.sign_in_provider === 'google.com';
  if (isOwner || identity.token.admin === true) return { uid: identity.uid, email: normalizedEmail, isOwner };

  if (identity.token.firebase?.sign_in_provider !== 'password') {
    throw new HttpsError('permission-denied', 'Administrator access is required.');
  }
  const [uidRecord, emailRecord] = await Promise.all([
    db.collection('admins').doc(identity.uid).get(),
    db.collection('admins').doc(normalizedEmail).get()
  ]);
  const teamRecord = uidRecord.exists ? uidRecord : emailRecord;
  if (!teamRecord.exists || teamRecord.data()?.active !== true || teamRecord.data()?.role !== 'team_admin') {
    throw new HttpsError('permission-denied', 'Administrator access is required.');
  }
  return { uid: identity.uid, email: normalizedEmail, isOwner: false };
}

async function requireOwner(request) {
  const owner = await requireAdmin(request);
  if (!owner.isOwner) {
    throw new HttpsError('permission-denied', 'Only the primary owner can create team accounts.');
  }
  return owner;
}

exports.createTeamAdmin = onCall({ region }, async (request) => {
  const actor = await requireOwner(request);
  const email = typeof request.data?.email === 'string'
    ? request.data.email.trim().toLowerCase()
    : '';
  const password = typeof request.data?.password === 'string' ? request.data.password : '';
  const displayName = typeof request.data?.displayName === 'string'
    ? request.data.displayName.trim().slice(0, 100)
    : '';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 150) {
    throw new HttpsError('invalid-argument', 'Enter a valid team member email address.');
  }
  if (password.length < 10 || password.length > 128) {
    throw new HttpsError('invalid-argument', 'Use a password between 10 and 128 characters.');
  }
  if (email === ownerEmail) {
    throw new HttpsError('already-exists', 'The owner Google account is already an administrator.');
  }

  let user;
  try {
    user = await auth.createUser({ email, password, displayName, emailVerified: false });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      throw new HttpsError('already-exists', 'An account with this email already exists.');
    }
    throw new HttpsError('internal', 'Could not create the team account.');
  }

  try {
    await auth.setCustomUserClaims(user.uid, { admin: true });
    const record = {
      uid: user.uid,
      email,
      displayName,
      role: 'team_admin',
      authType: 'password',
      active: true,
      createdAt: new Date().toISOString(),
      createdBy: actor.email
    };
    await Promise.all([
      db.collection('admins').doc(user.uid).set(record),
      db.collection('admins').doc(email).set(record)
    ]);
  } catch {
    await auth.deleteUser(user.uid).catch(() => {});
    throw new HttpsError('internal', 'Could not finish setting up the team account.');
  }

  return { email, displayName };
});

exports.sendPasswordReset = onCall({ region, secrets: [smtpPassword] }, async (request) => {
  await requireAdmin(request);
  const email = typeof request.data?.email === 'string'
    ? request.data.email.trim().toLowerCase()
    : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 150) {
    throw new HttpsError('invalid-argument', 'Enter a valid account email address.');
  }

  let account;
  try {
    account = await auth.getUserByEmail(email);
  } catch {
    throw new HttpsError('not-found', 'No account was found for that email.');
  }
  if (!account.providerData.some((provider) => provider.providerId === 'password')) {
    throw new HttpsError(
      'failed-precondition',
      'This account uses Google sign-in and does not have a Firebase password to reset.'
    );
  }

  try {
    const resetLink = await auth.generatePasswordResetLink(email, {
      url: publicAppUrl.value()
    });
    await mailTransport().sendMail({
      from: smtpUser.value(),
      to: email,
      subject: 'Reset your Navioraa account password',
      text: `An administrator requested a password reset for this account. Use this link to choose a new password: ${resetLink}`
    });
    return { sent: true };
  } catch {
    throw new HttpsError('internal', 'Could not send a password reset email.');
  }
});

exports.notifyCompanyOfInquiry = onDocumentCreated({
  document: 'contactInquiries/{inquiryId}',
  database: databaseId.value(),
  region,
  secrets: [smtpPassword]
}, async (event) => {
  const inquiry = event.data?.data();
  if (!inquiry) return;

  const recipient = companyInquiryEmail.value();

  const details = [
    `Name: ${inquiry.name || ''}`,
    `Email: ${inquiry.email || ''}`,
    `Phone: ${inquiry.phone || 'Not provided'}`,
    `Type: ${inquiry.inquiryType || 'General inquiry'}`,
    `Subject: ${inquiry.subject || 'New inquiry'}`,
    `Budget: ${inquiry.budget || 'Not provided'}`,
    `Timeline: ${inquiry.timeline || 'Not provided'}`,
    `Services: ${(inquiry.services || []).join(', ') || 'Not provided'}`,
    '',
    inquiry.message || ''
  ].join('\n');

  await mailTransport().sendMail({
    from: smtpUser.value(),
    to: recipient,
    replyTo: inquiry.email,
    subject: `[Navioraa inquiry] ${inquiry.subject || inquiry.inquiryType || 'New submission'}`,
    text: details
  });
});