import React, { type FormEvent, useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { getDisplayImageUrl } from '../utils/imageUrl';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { siteSettings, services, courses, projects, resources, teamMembers, submitInquiry } = useData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState('Business Project');
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const publishedServices = services.filter(service => service.status === 'published').slice(0, 6);
  const publishedCourses = courses.filter(course => course.status === 'published').slice(0, 5);
  const publishedProjects = projects.filter(project => project.status === 'published').slice(0, 3);
  const publishedResources = resources.filter(resource => resource.status === 'published').slice(0, 5);
  const publishedTeam = teamMembers.filter(member => member.status === 'published').slice(0, 2);
  const featuredProject = publishedProjects[0];
  const heroImage = featuredProject?.imageUrl || publishedServices[0]?.imageUrl;

  useEffect(() => {
    const revealNodes = document.querySelectorAll<HTMLElement>('.reveal');
    if (!('IntersectionObserver' in window)) {
      revealNodes.forEach(node => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealNodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [publishedServices.length, publishedCourses.length, publishedProjects.length, publishedResources.length, publishedTeam.length]);

  const handleInquirySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState('sending');
    try {
      await submitInquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        inquiryType: projectType,
        subject: `${projectType} inquiry`,
        message: message.trim(),
        services: [projectType]
      });
      setFormState('success');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch {
      setFormState('error');
    }
  };

  return (
    <div className="editorial-home">
      <section className="editorial-hero" id="top">
        <div className="editorial-wrap hero-wrap">
          <div className="hero-topline reveal">
            <span>Technology <i /> Training <i /> Digital innovation</span>
            <span className="availability"><b /> Available for new projects</span>
          </div>
          <div className="hero-layout">
            <div className="hero-copy">
              <p className="eyebrow reveal">Independent minds. Useful technology.</p>
              <h1 className="hero-title">
                <span className="hero-line reveal">Ideas into</span>
                <span className="hero-line hero-line-indent reveal">things that</span>
                <span className="hero-line hero-line-accent reveal">move us forward.</span>
              </h1>
              <div className="hero-bottom reveal">
                <p>{siteSettings.heroDescription || 'Navioraa helps students, startups and businesses learn technology, build practical projects and turn ideas into digital products.'}</p>
                <div className="hero-actions">
                  <a className="button button-dark" href="#work">Explore Navioraa <span aria-hidden="true">↗</span></a>
                  <button className="button button-text" onClick={() => navigate('/contact')}>Start a project <span aria-hidden="true">↗</span></button>
                </div>
              </div>
            </div>
            <div className="hero-art reveal" aria-label="Featured Navioraa project">
              <div className="art-grid" />
              {heroImage && <img src={heroImage} alt={featuredProject?.title || publishedServices[0]?.title || 'Navioraa digital project'} loading="eager" onError={event => { event.currentTarget.style.display = 'none'; }} />}
              <div className="art-tint" />
              <span className="art-index">N° 01 <span>—</span> DIGITAL PRACTICE</span>
              <div className="art-caption">
                <span>{featuredProject?.category || 'Learning through making'}</span>
                <strong>{featuredProject?.title || 'Build what comes next.'}</strong>
              </div>
              <span className="art-mark" aria-hidden="true">N</span>
            </div>
          </div>
          <div className="hero-foot reveal"><span>Scroll to explore</span><span className="scroll-rule" /><span>01 / 06</span></div>
        </div>
      </section>

      <section className="intro-section editorial-wrap reveal" id="about">
        <p className="section-index">01 / ABOUT NAVIORAA</p>
        <div className="intro-content">
          <h2>Technology should not just be learned.<br /><em>It should be used to build.</em></h2>
          <div className="intro-aside">
            <p>Navioraa brings practical IT training and digital project work together. We help curious learners gain confidence, and help ambitious teams turn good ideas into useful products.</p>
            <button className="underlined-link" onClick={() => navigate('/about')}>Our point of view <span>↗</span></button>
          </div>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="editorial-wrap">
          <div className="section-heading reveal"><p className="section-index">02 / WHAT WE DO</p><h2>Good work starts<br /><em>with a useful question.</em></h2><p className="heading-note">From first lesson to finished product, we make technology more practical.</p></div>
          <div className="service-list">
            {publishedServices.map((service, index) => (
              <details className="service-row reveal" key={service.id}>
                <summary><span className="row-number">{String(index + 1).padStart(2, '0')}</span><span className="row-title">{service.title}</span><span className="row-arrow" aria-hidden="true">↗</span></summary>
                <div className="service-detail"><p>{service.shortDescription}</p><button className="underlined-link" onClick={() => navigate('/services')}>Explore this service <span>↗</span></button></div>
              </details>
            ))}
            {!publishedServices.length && <p className="empty-note">New services are on the way.</p>}
          </div>
          <button className="underlined-link section-link" onClick={() => navigate('/services')}>All services <span>↗</span></button>
        </div>
      </section>

      <section className="learning-section" id="training">
        <div className="editorial-wrap learning-layout">
          <div className="learning-copy reveal"><p className="section-index">03 / LEARN</p><h2>Learn technology<br /><em>by building with it.</em></h2><p>Practical IT training for students and aspiring makers. Build a foundation, work through real challenges, and finish with projects you can show.</p><button className="button button-outline" onClick={() => navigate('/courses')}>Explore training <span>↗</span></button></div>
          <div className="learning-list">
            {publishedCourses.map((course, index) => (
              <button className="learning-row reveal" key={course.id} onClick={() => navigate('/courses')}>
                <span>{String(index + 1).padStart(2, '0')}</span><strong>{course.title}</strong><small>{course.duration}</small><span className="row-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
            {!publishedCourses.length && ['Python & Programming', 'AI & Machine Learning', 'Web Development', 'Project Development'].map((label, index) => <div className="learning-row" key={label}><span>{String(index + 1).padStart(2, '0')}</span><strong>{label}</strong><small>Explore path</small></div>)}
          </div>
        </div>
      </section>

      <section className="projects-section editorial-wrap" id="work">
        <div className="projects-head reveal"><div><p className="section-index">04 / SELECTED WORK</p><h2>Make it real.</h2></div><button className="underlined-link" onClick={() => navigate('/projects')}>All projects <span>↗</span></button></div>
        <div className="project-showcase">
          {publishedProjects.map((project, index) => (
            <article className={`project-feature project-feature-${index % 2 ? 'reverse' : 'forward'} reveal`} key={project.id}>
              <button className="project-image" onClick={() => navigate('/projects')} aria-label={`View ${project.title}`}>
                {project.imageUrl && <img src={project.imageUrl} alt={project.title} loading="lazy" onError={event => { event.currentTarget.style.display = 'none'; }} />}
                <span className="image-index">0{index + 1} / 0{publishedProjects.length}</span><span className="image-open">View project ↗</span>
              </button>
              <div className="project-copy"><p className="section-index">{project.category || 'Digital project'}</p><h3>{project.title}</h3><p>{project.description}</p><button className="underlined-link" onClick={() => navigate('/projects')}>Project details <span>↗</span></button></div>
            </article>
          ))}
          {!publishedProjects.length && <div className="project-empty reveal"><span>Selected work</span><h3>Useful ideas,<br />made tangible.</h3><button className="underlined-link" onClick={() => navigate('/contact')}>Discuss a project <span>↗</span></button></div>}
        </div>
      </section>

      <section className="resources-section" id="resources">
        <div className="editorial-wrap resources-layout">
          <div className="resources-intro reveal"><p className="section-index">05 / KEEP LEARNING</p><h2>Resources for<br /><em>the curious.</em></h2><p>Notes and materials for your next step, whether you are starting out or going deeper.</p><button className="underlined-link" onClick={() => navigate('/resources')}>Explore resources <span>↗</span></button></div>
          <div className="resource-list">
            {publishedResources.map((resource, index) => (
              <button className="resource-row reveal" key={resource.id} onClick={() => navigate('/resources')}><span>{String(index + 1).padStart(2, '0')}</span><strong>{resource.title}</strong><small>{resource.category || resource.fileType}</small><span className="row-arrow" aria-hidden="true">↗</span></button>
            ))}
            {!publishedResources.length && ['Programming notes', 'AI learning materials', 'Web development guides', 'Project resources'].map((label, index) => <button className="resource-row" key={label} onClick={() => navigate('/resources')}><span>{String(index + 1).padStart(2, '0')}</span><strong>{label}</strong><small>Learning material</small><span className="row-arrow" aria-hidden="true">↗</span></button>)}
          </div>
        </div>
      </section>

      <section className="manifesto-section">
        <div className="editorial-wrap manifesto-layout">
          <p className="section-index reveal">06 / WHY NAVIORAA</p>
          <div className="manifesto-words" aria-label="Learn. Build. Create. Grow."><span className="reveal">LEARN.</span><span className="reveal">BUILD.</span><span className="reveal">CREATE.</span><span className="reveal">GROW.</span></div>
          <p className="manifesto-note reveal">We combine technology training with practical project development, so knowledge does not stop at the screen. You learn by making something that matters.</p>
        </div>
      </section>

      <section className="process-section editorial-wrap">
        <div className="process-heading reveal"><p className="section-index">A GOOD WAY FORWARD</p><h2>How we work</h2></div>
        <div className="process-list">
          {[['01', 'Discover', 'Start with your goals, context and the people who will use the result.'], ['02', 'Plan', 'Turn the big idea into a clear, manageable path.'], ['03', 'Build', 'Learn, design and develop through practical work.'], ['04', 'Test', 'Refine the details and make sure it works for real people.'], ['05', 'Launch', 'Share the result and keep improving from there.']].map(([number, title, description]) => (
            <details className="process-step reveal" key={number}><summary><span>{number}</span><strong>{title}</strong><i aria-hidden="true">+</i></summary><p>{description}</p></details>
          ))}
        </div>
      </section>

      <section className="team-section" id="team">
        <div className="editorial-wrap">
          <div className="team-heading reveal"><div><p className="section-index">PEOPLE MAKE THE WORK</p><h2>Meet the people<br /><em>behind Navioraa.</em></h2></div><button className="underlined-link" onClick={() => navigate('/team')}>The wider team <span>↗</span></button></div>
          <div className="team-list">
            {publishedTeam.map((member, index) => (
              <article className="team-profile reveal" key={member.id}><div className="team-photo">{member.photoUrl ? <img src={getDisplayImageUrl(member.photoUrl)} alt={member.name} loading="lazy" onError={event => { event.currentTarget.style.display = 'none'; }} /> : <span className="team-initials" aria-label={`${member.name} portrait not added`}>{member.name.split(' ').map(part => part[0]).join('').slice(0, 2)}</span>}<span>0{index + 1}</span></div><div className="team-info"><p className="section-index">{member.role}</p><h3>{member.name}</h3><p>{member.bio}</p></div></article>
            ))}
            {!publishedTeam.length && <p className="empty-note">Our team profiles will be here soon.</p>}
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="editorial-wrap contact-layout">
          <div className="contact-intro reveal"><p className="section-index">HAVE A GOOD IDEA?</p><h2>Let’s build<br /><em>something useful.</em></h2><p>Have a project, a question or a learning goal? Tell us where you want to go.</p><a className="contact-email" href={`mailto:${siteSettings.contactEmail || 'naviora.pvt@gmail.com'}`}>{siteSettings.contactEmail || 'naviora.pvt@gmail.com'} <span>↗</span></a><a className="contact-whatsapp" href={`https://wa.me/${siteSettings.whatsappNumber?.replace(/[^0-9]/g, '') || '919890187383'}`} target="_blank" rel="noreferrer">WhatsApp <span>↗</span></a></div>
          <form className="contact-form reveal" onSubmit={handleInquirySubmit}>
            <div className="form-grid"><label>Your name<input value={name} onChange={event => { setName(event.target.value); setFormState('idle'); }} required autoComplete="name" /></label><label>Email address<input type="email" value={email} onChange={event => { setEmail(event.target.value); setFormState('idle'); }} required autoComplete="email" /></label></div>
            <div className="form-grid"><label>Phone <span>(optional)</span><input type="tel" value={phone} onChange={event => { setPhone(event.target.value); setFormState('idle'); }} autoComplete="tel" /></label><label>What are you looking for?<select value={projectType} onChange={event => { setProjectType(event.target.value); setFormState('idle'); }}><option>Business Project</option><option>IT Training</option><option>Software Development</option><option>AI Solutions</option><option>General Inquiry</option></select></label></div>
            <label>Your message<textarea value={message} onChange={event => { setMessage(event.target.value); setFormState('idle'); }} required rows={4} /></label>
            {formState === 'success' && <p className="form-feedback form-success" role="status">Thanks. Your message is with our team.</p>}
            {formState === 'error' && <p className="form-feedback form-error" role="alert">We could not send your message. Please try again.</p>}
            <button className="button button-dark form-submit" type="submit" disabled={formState === 'sending'}>{formState === 'sending' ? 'Sending…' : 'Send message'} <span aria-hidden="true">↗</span></button>
          </form>
        </div>
      </section>
    </div>
  );
};
