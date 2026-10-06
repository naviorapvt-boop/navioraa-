import { SiteSettings, Service, Course, Project, Resource, TeamMember, ContactInquiry } from '../types';

export const initialSiteSettings: SiteSettings = {
  id: 'global',
  siteName: 'NAVIORAA',
  tagline: 'Learn. Build. Create. Grow.',
  contactEmail: 'contact@navioraa.com',
  contactPhone: '+1 (555) 019-9283',
  whatsappNumber: '+15550199283',
  address: 'Navioraa Cloud & Engineering Labs, Global Innovation Center',
  githubUrl: 'https://github.com/navioraa-systems',
  linkedinUrl: 'https://linkedin.com/company/navioraa',
  twitterUrl: 'https://x.com/navioraa_tech',
  heroHeadline: 'Turn Your Ideas Into Real-World Technology.',
  heroDescription: 'Learn in-demand IT skills, build practical enterprise-grade projects, and explore innovative cloud & AI technology solutions with Navioraa.',
  heroBadge: 'LEARN. BUILD. INNOVATE.',
  updatedAt: new Date().toISOString()
};

export const initialServices: Service[] = [
  {
    id: 'srv-custom-software',
    serviceCode: 'Service 01 · Backend',
    title: 'Custom Software Development',
    slug: 'custom-software-development',
    category: 'custom-software',
    tierBadge: 'Kernel v6.8-LTS',
    shortDescription: 'Distributed microservices, resilient clean backend architecture, and high-throughput concurrent APIs designed to scale horizontally across multi-tenant environments without degradation.',
    content: 'Full-lifecycle software engineering focusing on domain-driven design, event-driven CQRS patterns, and sub-millisecond Redis caching. We engineer distributed backends that handle high concurrent transactions with zero data inconsistency.',
    features: [
      'Event-driven CQRS patterns',
      'Sub-millisecond Redis caching',
      'Strict OpenAPI / gRPC protocols',
      'Automated ACID database migrations'
    ],
    technologies: ['Python 3.12', 'Go 1.23', 'Node.js', 'PostgreSQL', 'Docker', 'Redis Cluster'],
    milestones: [
      { phase: 'Phase I', title: 'W1-2: Domain Analysis & Schema Modeling', duration: '2 Weeks' },
      { phase: 'Phase II', title: 'W3-6: High-Concurrency Service Core', duration: '4 Weeks' },
      { phase: 'Phase III', title: 'W7-8: Chaos & Penetration Testing', duration: '2 Weeks' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'published',
    sortOrder: 1
  },
  {
    id: 'srv-modern-web',
    serviceCode: 'Service 02 · Frontend & Fullstack',
    title: 'Modern Web Application Development',
    slug: 'modern-web-application-development',
    category: 'modern-web',
    tierBadge: 'V8 Server Actions',
    shortDescription: 'Sub-second latency architectures built with Next.js 15, React 19, TypeScript, and reactive state systems backed by serverless edge engines and granular real-time sync.',
    content: 'We engineer enterprise-grade web platforms that achieve 100/100 Lighthouse performance scores. Featuring incremental static builds, optimistic client hydration, and accessible WCAG AA certified interfaces.',
    features: [
      '100/100 Lighthouse Performance',
      'Static & SSR Incremental Builds',
      'Zero-layout shift telemetry',
      'Comprehensive accessibility (WCAG AA)'
    ],
    technologies: ['Next.js 15', 'React 19', 'TypeScript', 'GraphQL', 'Supabase', 'Firebase'],
    milestones: [
      { phase: 'Phase I', title: 'W1: Design System & Component Archetypes', duration: '1 Week' },
      { phase: 'Phase II', title: 'W2-5: Dynamic Hydration & Data Layer', duration: '4 Weeks' },
      { phase: 'Phase III', title: 'W6: Edge Deployment & CDN Warmup', duration: '1 Week' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'published',
    sortOrder: 2
  },
  {
    id: 'srv-mobile-apps',
    serviceCode: 'Service 03 · Native & Cross',
    title: 'Mobile Application Development',
    slug: 'mobile-application-development',
    category: 'mobile-apps',
    tierBadge: 'Native Bridge 2.0',
    shortDescription: 'Fluid iOS and Android cross-platform solutions delivering genuine 120Hz native interactions, offline-first deterministic sync algorithms, and biometrics integration.',
    content: 'Native and cross-platform mobile systems built with React Native, Flutter, Swift, and Kotlin. We implement CRDT-driven offline synchronization and secure enclave hardware encryption.',
    features: [
      'CRDT-driven offline synchronization',
      'Automated App Store & Play Console CI',
      'Secure enclave hardware vaulting',
      'Targeted push notification infrastructure'
    ],
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'WatermelonDB', 'SQLite'],
    milestones: [
      { phase: 'Phase I', title: 'W1-2: Mobile Architecture & Offline Schema', duration: '2 Weeks' },
      { phase: 'Phase II', title: 'W3-7: Feature Engineering & Native Shims', duration: '5 Weeks' },
      { phase: 'Phase III', title: 'W8: TestFlight / Internal Track Canary', duration: '1 Week' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'published',
    sortOrder: 3
  },
  {
    id: 'srv-cognitive-ai',
    serviceCode: 'Service 04 · Cognitive Core',
    title: 'AI & Machine Learning Solutions',
    slug: 'ai-machine-learning-solutions',
    category: 'cognitive-ai',
    tierBadge: 'CUDA 12.4 Enabled',
    shortDescription: 'Enterprise-grade RAG knowledge retrieval systems, domain-specific fine-tuned LLMs, automated agent workflows, and predictive analytics operating under air-gapped security boundaries.',
    content: 'Cognitive artificial intelligence solutions engineered with PyTorch, LangChain, and Qdrant. Featuring hybrid sparse-dense vector retrieval, LoRA parameter-efficient tuning, and strict hallucination guardrails.',
    features: [
      'Hallucination containment filters',
      'Hybrid sparse-dense vector retrieval',
      'LoRA & QLoRA parameter efficient tuning',
      'Private tenant data segregation'
    ],
    technologies: ['PyTorch', 'LangChain', 'LlamaIndex', 'Pinecone', 'FastAPI', 'HuggingFace'],
    milestones: [
      { phase: 'Phase I', title: 'W1-2: Vector Pipeline & Ingestion Strategy', duration: '2 Weeks' },
      { phase: 'Phase II', title: 'W3-6: RAG Orchestration & Guardrail Synthesis', duration: '4 Weeks' },
      { phase: 'Phase III', title: 'W7-8: Evaluation Metrics & LLM Ops Gate', duration: '2 Weeks' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'published',
    sortOrder: 4
  },
  {
    id: 'srv-cloud-devops',
    serviceCode: 'Service 05 · Resiliency',
    title: 'Cloud & DevOps Infrastructure',
    slug: 'cloud-devops-infrastructure',
    category: 'cloud-devops',
    tierBadge: 'GitOps Flux/Argo',
    shortDescription: 'Multi-region high-availability topology, zero-downtime Kubernetes rollouts, robust IaC codification, and immutable CI/CD deployment pipelines with compliance monitoring.',
    content: 'Resilient cloud infrastructure with Kubernetes, Terraform, and automated GitOps pipelines. We ensure continuous SLA availability, SOC2 Type II compliance controls, and real-time cluster cost optimization.',
    features: [
      '100% Declarative Terraform stacks',
      'SOC2 Type II compliant controls',
      'Automated blue/green zero-outage rollouts',
      'Real-time cluster cost optimization'
    ],
    technologies: ['AWS EKS', 'GCP GKE', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Prometheus'],
    milestones: [
      { phase: 'Phase I', title: 'W1: Architecture Audit & VPC Topology', duration: '1 Week' },
      { phase: 'Phase II', title: 'W2-4: Terraform Module Codification', duration: '3 Weeks' },
      { phase: 'Phase III', title: 'W5-6: Cluster Switchover & Load Canary', duration: '2 Weeks' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'published',
    sortOrder: 5
  },
  {
    id: 'srv-corporate-training',
    serviceCode: 'Service 06 · Knowledge Force',
    title: 'Corporate IT Training & Upskilling',
    slug: 'corporate-it-training-upskilling',
    category: 'training',
    tierBadge: 'Lab Sandbox v3',
    shortDescription: 'Tailored engineering bootcamps, hands-on production chaos simulations, cloud security certifications, and enterprise team-level mentorship for scalable engineering squads.',
    content: 'Customized workforce training programs designed for technology organizations. Live instructor-led labs, disposable cloud sandboxes, pre/post-assessment benchmarks, and verifiable team accreditation.',
    features: [
      '100% Live Instructor-Led Labs',
      'Isolated disposable cloud sandboxes',
      'Pre- & Post-assessment benchmarks',
      'Direct enterprise accreditation'
    ],
    technologies: ['Kubernetes SRE', 'LLMOps Mastery', 'Cloud Arch', 'SecOps', 'Go Internals', 'System Design'],
    milestones: [
      { phase: 'Phase I', title: 'W1: Baseline Skill Diagnostic & Curriculum Tailoring', duration: '1 Week' },
      { phase: 'Phase II', title: 'W2-4: Intensive Live Lab Execution', duration: '3 Weeks' },
      { phase: 'Phase III', title: 'W5: Capstone System Defense Review', duration: '1 Week' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'published',
    sortOrder: 6
  }
];

export const initialCourses: Course[] = [
  {
    id: 'crs-091',
    code: 'CRS-091',
    title: 'Distributed Cloud Native Architectures',
    slug: 'distributed-cloud-native-architectures',
    category: 'cloud-devops',
    difficulty: 'Advanced',
    duration: '12 Weeks',
    hours: '84h',
    seats: '24 Seats',
    rating: '4.95',
    price: '$1,450',
    shortDescription: 'Production-grade orchestrations, multi-region Kubernetes clusters, service meshes, and self-healing cloud deployments.',
    description: 'Master advanced Kubernetes container mesh management, Terraform infrastructure as code, Istio service mesh observability, and automated chaos engineering drills.',
    technologies: ['K8s', 'Terraform', 'Istio', 'Docker', 'Prometheus', 'Helm'],
    curriculum: [
      { module: 'Module 1-3: Kubernetes Internals & Raft Consensus', topics: 'Deep dive into etcd, API server rate limiting, custom controllers, and operator pattern.' },
      { module: 'Module 4-8: Service Mesh & Traffic Topology', topics: 'mTLS encryption, dynamic canary traffic routing with Istio, Envoy proxy filters.' },
      { module: 'Module 9-12: Zero-Downtime Multi-Region Disaster Recovery', topics: 'Cross-cluster gossip protocols, automated failover, and GitOps rollout pipelines.' }
    ],
    learningOutcomes: [
      'Design fault-tolerant multi-cluster Kubernetes deployments',
      'Implement strict mTLS network security policies',
      'Automate disaster recovery failover workflows'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'published',
    sortOrder: 1,
    cohortStartDate: 'Oct 14, 2026',
    schedule: 'Mon / Wed / Sat (Live)'
  },
  {
    id: 'crs-092',
    code: 'CRS-092',
    title: 'Zero-Trust Cloud Vault Engineering',
    slug: 'zero-trust-cloud-vault-engineering',
    category: 'cloud-devops',
    difficulty: 'Enterprise',
    duration: '8 Weeks',
    hours: '60h',
    seats: '18 Seats',
    rating: '4.98',
    price: '$1,850',
    shortDescription: 'Hardware security modules, cryptographic secret management, mTLS identity verification, and automated compliance policies.',
    description: 'Build enterprise-grade cloud security architectures with HashiCorp Vault, AWS KMS envelope encryption, OpenID Connect authentication, and continuous security auditing.',
    technologies: ['Vault', 'AWS KMS', 'OIDC', 'eBPF', 'Trivy', 'OpenFGA'],
    curriculum: [
      { module: 'Module 1-2: Secret Lifecycle & Key Derivation', topics: 'Shamir secret sharing, dynamic database credentials, and PKI engine configuration.' },
      { module: 'Module 3-5: Zero-Trust Network Policy & mTLS', topics: 'SPIFFE/SPIRE workload identity attestation, automated cert rotation, and envelope encryption.' },
      { module: 'Module 6-8: SOC2 Type II Audit & Defense Drill', topics: 'Real-time telemetry audit trails, container runtime threat detection with eBPF.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'published',
    sortOrder: 2,
    cohortStartDate: 'Oct 22, 2026',
    schedule: 'Tue / Thu (Live)'
  },
  {
    id: 'crs-093',
    code: 'CRS-093',
    title: 'Scalable LLM Pipeline & Inference Ops',
    slug: 'scalable-llm-pipeline-inference-ops',
    category: 'ai-ml',
    difficulty: 'Advanced',
    duration: '10 Weeks',
    hours: '75h',
    seats: '20 Seats',
    rating: '4.99',
    price: '$1,600',
    shortDescription: 'vLLM acceleration, vector stores, distributed fine-tuning infrastructure, and autonomous agent orchestration.',
    description: 'Learn modern LLMOps: high-throughput serving with vLLM, hybrid vector databases, LoRA parameter-efficient fine-tuning on custom corpora, and multi-agent systems with LangGraph.',
    technologies: ['PyTorch', 'Ray', 'CUDA', 'vLLM', 'LangChain', 'Qdrant'],
    curriculum: [
      { module: 'Module 1-3: Vector Database Engineering & Chunking', topics: 'Sparse-dense hybrid search, re-ranking algorithms, semantic caching in Redis.' },
      { module: 'Module 4-7: Model Fine-Tuning & Quantization', topics: 'QLoRA on consumer GPUs, Unsloth optimization, FP8 matrix acceleration.' },
      { module: 'Module 8-10: vLLM Distributed Serving & Autonomous Agents', topics: 'PagedAttention mechanics, multi-agent supervisor patterns, tool execution loops.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'published',
    sortOrder: 3,
    cohortStartDate: 'Nov 01, 2026',
    schedule: 'Tue / Fri / Sun (Live)'
  },
  {
    id: 'crs-094',
    code: 'CRS-094',
    title: 'FinTech High-Frequency Micro-Engines',
    slug: 'fintech-high-frequency-micro-engines',
    category: 'custom-software',
    difficulty: 'Advanced',
    duration: '6 Weeks',
    hours: '42h',
    seats: '15 Seats',
    rating: '4.90',
    price: '$1,200',
    shortDescription: 'Sub-millisecond Rust & WebSocket core transactions, lock-free queues, and order-matching architectures.',
    description: 'Construct low-latency financial transaction engines in Rust. Master lock-free ring buffers, WebSocket order broadcast feeds, and ACID balance consensus.',
    technologies: ['Rust', 'Tokio', 'gRPC', 'WebSockets', 'PostgreSQL'],
    curriculum: [
      { module: 'Module 1-2: Rust Memory Model & Zero-Cost Abstractions', topics: 'Ownership semantics, unmanaged ring buffers, cache-line alignment.' },
      { module: 'Module 3-4: Order Matching Logic & Book Reconstruction', topics: 'L2/L3 order book data structures, deterministic state machine replay.' },
      { module: 'Module 5-6: Async WebSocket Ingestion & Audit Pipeline', topics: 'Tokio broadcast channels, double-entry ledger bookkeeping, and snapshotting.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    status: 'draft',
    sortOrder: 4,
    cohortStartDate: 'In Preparation',
    schedule: 'Cohort Forming'
  },
  {
    id: 'crs-095',
    code: 'CRS-095',
    title: 'Enterprise Go Microservices at Scale',
    slug: 'enterprise-go-microservices-at-scale',
    category: 'cloud-devops',
    difficulty: 'Intermediate',
    duration: '8 Weeks',
    hours: '55h',
    seats: '25 Seats',
    rating: '4.93',
    price: '$980',
    shortDescription: 'Domain-driven design, Kafka event streams, OpenTelemetry observability, and concurrent goroutine patterns.',
    description: 'Build enterprise-grade microservice ecosystems in Go. Learn clean hexagonal architecture, transactional outbox pattern with Kafka, and distributed tracing with OpenTelemetry.',
    technologies: ['Golang', 'Kafka', 'OTel', 'Docker', 'PostgreSQL', 'gRPC'],
    curriculum: [
      { module: 'Module 1-3: Go Concurrency & Channels', topics: 'Worker pools, context propagation, error group patterns, and memory profiling.' },
      { module: 'Module 4-6: Event-Driven Kafka Pipeline', topics: 'Idempotent consumers, schema registry with Protobuf, dead letter queues.' },
      { module: 'Module 7-8: Distributed Tracing & Chaos Validation', topics: 'OpenTelemetry collector setup, Jaeger trace analysis, Prometheus custom counters.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'published',
    sortOrder: 5,
    cohortStartDate: 'Oct 28, 2026',
    schedule: 'Wed / Sat (Live)'
  },
  {
    id: 'crs-096',
    code: 'CRS-096',
    title: 'Full-Stack Web Development',
    slug: 'full-stack-web-development',
    category: 'full-stack',
    difficulty: 'Intermediate',
    duration: '12 Weeks',
    hours: '240h',
    seats: '24 Seats',
    rating: '4.95',
    price: '$1,450',
    shortDescription: 'Master the state of the art: MERN stack transition to Next.js 15 App Router, TypeScript runtime verification, and scalable Server Actions with Tailwind CSS.',
    description: 'Complete hands-on full-stack training covering React 19, Next.js 15, Node.js, Express, PostgreSQL, Prisma ORM, and automated CI/CD.',
    technologies: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind', 'Node.js', 'PostgreSQL'],
    curriculum: [
      { module: 'Module 1-3: Strict Type Systems & Next.js 15', topics: 'Server Components, Async Request APIs, and Zod schema validation.' },
      { module: 'Module 4-8: Micro-APIs & Distributed Persistence', topics: 'PostgreSQL with Prisma ORM, Redis caching layer, and Stripe Payment Webhooks.' },
      { module: 'Module 9-12: CI/CD & Production Capstone', topics: 'Building a collaborative SaaS workspace with real-time WebSockets and Docker deploy.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'published',
    sortOrder: 6,
    cohortStartDate: 'Oct 14, 2026',
    schedule: 'Mon / Wed / Sat (Live)'
  },
  {
    id: 'crs-097',
    code: 'CRS-097',
    title: 'Python for Software & Automation',
    slug: 'python-for-software-automation',
    category: 'python-data',
    difficulty: 'Beginner',
    duration: '8 Weeks',
    hours: '160h',
    seats: '30 Seats',
    rating: '4.91',
    price: '$980',
    shortDescription: 'Zero to architect: Python 3.12 object-oriented paradigm, async non-blocking operations, FastAPI microservice design, and enterprise web scrapers.',
    description: 'Learn modern Python programming from scratch through production applications. Master asyncio, Pydantic validation, FastAPI RESTful services, and web automation.',
    technologies: ['Python 3.12', 'FastAPI', 'AsyncIO', 'Playwright', 'Docker'],
    curriculum: [
      { module: 'Module 1-2: Core Python & Modern Syntax', topics: 'Memory model, GIL mechanics, typing annotations, and OOP class hierarchies.' },
      { module: 'Module 3-5: Asynchronous I/O & FastAPI', topics: 'Event loops, coroutines, dependency injection, and Pydantic validation specs.' },
      { module: 'Module 6-8: Resilient Automation & Capstone', topics: 'Playwright scraping, Celery job queues, and AWS Lambda serverless handlers.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'published',
    sortOrder: 7,
    cohortStartDate: 'Oct 20, 2026',
    schedule: 'Wed / Fri / Sun (Live)'
  }
];

export const initialProjects: Project[] = [
  {
    id: 'prj-rag-engine',
    title: 'Navioraa Omniscient RAG Engine',
    slug: 'navioraa-omniscient-rag-engine',
    category: 'AI Applications',
    badge: 'Production Deployment',
    description: 'Distributed enterprise knowledge retrieval engine processing over 12 million documents in real time. Features multi-hop vector search, automated context compression, and sub-120ms token time-to-first-byte.',
    technologies: ['Qdrant Vector DB', 'Kubernetes', 'FastAPI', 'PyTorch', 'LangChain'],
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://demo.navioraa.internal/rag-engine',
    sourceUrl: 'https://github.com/navioraa-systems/omniscient-rag',
    featured: true,
    status: 'published',
    sortOrder: 1
  },
  {
    id: 'prj-telemetry',
    title: 'Aether Telemetry & Log Ingestion',
    slug: 'aether-telemetry-log-ingestion',
    category: 'Cloud & Telemetry',
    badge: 'Enterprise Cloud Pipeline',
    description: 'Hyperscale telemetry fabric capable of ingesting 2.4 GB/sec of structured audit logs. Built with Kafka event streaming, zero-loss ClickHouse storage, and automated anomaly classification using lightweight on-device ML.',
    technologies: ['Apache Kafka', 'ClickHouse', 'Go Engine', 'Grafana Cloud', 'Kubernetes'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://demo.navioraa.internal/aether-telemetry',
    sourceUrl: 'https://github.com/navioraa-systems/aether-stream',
    featured: true,
    status: 'published',
    sortOrder: 2
  },
  {
    id: 'prj-vault-guard',
    title: 'Zero-Trust Identity Orchestrator',
    slug: 'zero-trust-identity-orchestrator',
    category: 'Distributed Systems',
    badge: 'Security Vault Spec',
    description: 'Centralized microservice authorization plane verifying workload identities via dynamic SPIFFE IDs, rotating mTLS certificates every 60 minutes with zero downtime.',
    technologies: ['HashiCorp Vault', 'SPIFFE / SPIRE', 'Rust', 'Docker Swarm'],
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://demo.navioraa.internal/vault-orchestrator',
    sourceUrl: 'https://github.com/navioraa-systems/vault-mesh',
    featured: true,
    status: 'published',
    sortOrder: 3
  },
  {
    id: 'prj-student-portal',
    title: 'Navioraa Cloud Lab Environment',
    slug: 'navioraa-cloud-lab-environment',
    category: 'Web Systems',
    badge: 'Academy Cloud LMS',
    description: 'Interactive browser-based terminal and container sandbox for students to execute Linux commands, write Python and Go code, and deploy mock microservices directly in cloud isolation.',
    technologies: ['Next.js 15', 'WebSockets', 'Docker API', 'TypeScript', 'Tailwind'],
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://demo.navioraa.internal/cloud-lab',
    sourceUrl: 'https://github.com/navioraa-systems/cloud-sandbox',
    featured: false,
    status: 'published',
    sortOrder: 4
  }
];

export const initialResources: Resource[] = [
  {
    id: 'res-python-concurrency',
    title: 'Python 3.12 Concurrency & GIL Internals',
    description: 'Comprehensive engineering guide detailing the Python sub-interpreter model, per-interpreter GIL improvements, and async event loop benchmarks.',
    category: 'Engineering Notes',
    fileType: 'PDF Document',
    fileUrl: 'https://docs.navioraa.internal/notes/python-concurrency-deep-dive.pdf',
    fileSize: '4.2 MB',
    downloadCount: 1420,
    featured: true,
    status: 'published'
  },
  {
    id: 'res-k8s-zerotrust',
    title: 'Zero-Trust Kubernetes Security Cheat Sheet',
    description: 'Hardening guide for production clusters: Pod security standards, admission webhooks, Cilium eBPF network policies, and audit logging.',
    category: 'Architecture Guide',
    fileType: 'Markdown & PDF',
    fileUrl: 'https://docs.navioraa.internal/notes/k8s-zero-trust-hardening.pdf',
    fileSize: '2.8 MB',
    downloadCount: 980,
    featured: true,
    status: 'published'
  },
  {
    id: 'res-rag-blueprint',
    title: 'Enterprise RAG Architecture & Vector Indexing Blueprint',
    description: 'Production blueprint comparing HNSW vs IVF indexing, chunking strategies, hybrid search reciprocal rank fusion (RRF), and prompt caching.',
    category: 'System Blueprints',
    fileType: 'Technical Whitepaper',
    fileUrl: 'https://docs.navioraa.internal/whitepapers/rag-enterprise-blueprint.pdf',
    fileSize: '6.5 MB',
    downloadCount: 2310,
    featured: true,
    status: 'published'
  },
  {
    id: 'res-go-microservices',
    title: 'Go Microservices Clean Hexagonal Architecture',
    description: 'Complete boilerplate repository structure, domain model decoupling, transactional outbox pattern, and Kafka consumer group handling.',
    category: 'Tutorials & Code',
    fileType: 'Code Blueprint (ZIP)',
    fileUrl: 'https://docs.navioraa.internal/templates/go-hexagonal-template.zip',
    fileSize: '1.2 MB',
    downloadCount: 850,
    featured: false,
    status: 'published'
  }
];

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'team-abhishek',
    name: 'Abhishek Sharma',
    role: 'Founder & Lead Systems Architect',
    bio: 'Software architect and technology educator with extensive experience in distributed systems, cloud computing, and AI engineering. Mentored thousands of students into elite tech careers.',
    skills: ['Distributed Systems', 'Cloud Architecture', 'Python & AI', 'Kubernetes', 'High-Scale Backends'],
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
    sortOrder: 1,
    status: 'published'
  },
  {
    id: 'team-alex',
    name: 'Alex Mercer',
    role: 'Principal Cloud Infrastructure Architect',
    bio: 'Former senior DevOps engineer specializing in multi-region Kubernetes clusters, zero-trust cryptographic vaults, and real-time observability telemetry.',
    skills: ['Kubernetes', 'HashiCorp Vault', 'Terraform', 'eBPF', 'Site Reliability Engineering'],
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
    sortOrder: 2,
    status: 'published'
  },
  {
    id: 'team-elena',
    name: 'Elena Vance',
    role: 'Lead AI & Machine Learning Architect',
    bio: 'Researcher and software engineer focused on LLM fine-tuning, retrieval-augmented generation (RAG), and high-throughput model serving pipelines.',
    skills: ['PyTorch', 'LangChain', 'vLLM', 'Vector Databases', 'Transformers'],
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
    sortOrder: 3,
    status: 'published'
  }
];

export const initialInquiries: ContactInquiry[] = [
  {
    id: 'INQ-8821',
    name: 'Søren Lindqvist',
    email: 'soren.l@nordicfintech.com',
    phone: '+45 20 12 34 56',
    inquiryType: 'Software Development',
    subject: 'Fintech Microservices Migration',
    message: 'We are assessing migration of 40+ microservices to isolated private Kubernetes clusters. Requesting quote and architectural audit timeline.',
    services: ['Custom Software', 'Cloud & DevOps'],
    budget: 'Tier 3 ($30k - $60k)',
    timeline: 'Standard (6-8 Weeks)',
    status: 'New',
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString()
  },
  {
    id: 'INQ-8822',
    name: 'Elena Vance',
    email: 'evance@hyperstack.io',
    phone: '+1 555 987 6543',
    inquiryType: 'IT Training',
    subject: 'Enterprise LMS Bulk Cohort',
    message: 'Inquiring about bulk team enrollment (24 engineers) for the Zero-Trust Cloud Vault Engineering cohort starting next month.',
    services: ['Corporate Training'],
    budget: 'Tier 2 ($15k - $30k)',
    timeline: 'Urgent (2-4 Weeks)',
    status: 'New',
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString()
  },
  {
    id: 'INQ-8823',
    name: 'Marcus Sterling',
    email: 'm.sterling@apexgov.us',
    phone: '+1 555 112 2334',
    inquiryType: 'Cloud & DevOps',
    subject: 'GovCloud Audit & Compliance',
    message: 'Need immediate compliance verification report and SOC2 Type II mirror documentation for federal partner onboarding.',
    services: ['Cloud & DevOps'],
    budget: 'Tier 4 ($60k+)',
    timeline: 'Urgent (2-4 Weeks)',
    status: 'In Progress',
    adminNotes: 'Spoke with Marcus on Oct 5. Scheduled audit briefing.',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: 'INQ-8824',
    name: 'Kavita Raman',
    email: 'kavita@synapseai.io',
    phone: '+1 555 334 4556',
    inquiryType: 'AI Solutions',
    subject: 'Dedicated Inference Engine Architecture',
    message: 'Exploring dedicated inference engine deployment with multi-tenant isolation. Can we schedule an engineering walkthrough this Thursday?',
    services: ['Cognitive AI & RAG'],
    budget: 'Tier 2 ($15k - $30k)',
    timeline: 'Standard (6-8 Weeks)',
    status: 'New',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  }
];
