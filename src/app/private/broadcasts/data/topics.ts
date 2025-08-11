export type Topic = {
  id: string;
  name: string;
  category: string;
  image: string;
  featured?: boolean;
};

function poster(query: string, w = 480, h = 270) {
  // Landscape placeholder images; hard-coded query is required
  return `/placeholder.svg?height=${h}&width=${w}&query=${encodeURIComponent(query)}`;
}

// Curated, modern set for freelancers in Dev, AI, Marketing, Sales, and Freelance business
export const allTopics: Topic[] = [
  // AI & Agents
  {
    id: 'ai-foundations',
    name: 'AI Foundations',
    category: 'AI',
    image: poster('futuristic neon ai foundations landscape'),
    featured: true
  },
  {
    id: 'genai',
    name: 'Generative AI',
    category: 'AI',
    image: poster('generative ai vivid gradient landscape')
  },
  {
    id: 'llms',
    name: 'Large Language Models',
    category: 'AI',
    image: poster('large language models waves landscape')
  },
  {
    id: 'agents',
    name: 'AI Agents & Workflows',
    category: 'AI',
    image: poster('ai agents nodes graph landscape'),
    featured: true
  },
  {
    id: 'prompt-engineering',
    name: 'Prompt Engineering',
    category: 'AI',
    image: poster('prompt engineering tips landscape')
  },
  {
    id: 'llmops',
    name: 'LLMOps & Evaluation',
    category: 'AI',
    image: poster('llmops evaluation dashboards landscape')
  },
  {
    id: 'vector-search',
    name: 'Vector Search & RAG',
    category: 'AI',
    image: poster('vector database rag landscape')
  },

  // Development
  {
    id: 'web-dev',
    name: 'Web Development',
    category: 'Development',
    image: poster('modern web development gradient landscape'),
    featured: true
  },
  {
    id: 'react',
    name: 'React',
    category: 'Development',
    image: poster('react neon orbit landscape')
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'Development',
    image: poster('nextjs dark glossy landscape')
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Development',
    image: poster('typescript sharp code landscape')
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Development',
    image: poster('nodejs runtime performance landscape')
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Development',
    image: poster('python clean code data landscape')
  },
  { id: 'go', name: 'Go', category: 'Development', image: poster('golang performance landscape') },
  {
    id: 'rust',
    name: 'Rust',
    category: 'Development',
    image: poster('rust systems performance landscape')
  },
  {
    id: 'mobile-dev',
    name: 'Mobile Development',
    category: 'Development',
    image: poster('mobile development apps landscape')
  },
  {
    id: 'testing',
    name: 'Testing & QA',
    category: 'Development',
    image: poster('testing qa tdd landscape')
  },

  // Cloud & DevOps
  {
    id: 'cloud-aws',
    name: 'AWS',
    category: 'Cloud',
    image: poster('aws cloud services landscape')
  },
  {
    id: 'cloud-gcp',
    name: 'GCP',
    category: 'Cloud',
    image: poster('gcp cloud platform landscape')
  },
  {
    id: 'cloud-azure',
    name: 'Azure',
    category: 'Cloud',
    image: poster('azure cloud enterprise landscape')
  },
  {
    id: 'docker',
    name: 'Docker & Containers',
    category: 'DevOps',
    image: poster('docker containers shipping landscape')
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    category: 'DevOps',
    image: poster('kubernetes clusters landscape')
  },
  {
    id: 'terraform',
    name: 'Terraform & IaC',
    category: 'DevOps',
    image: poster('terraform infrastructure as code landscape')
  },
  {
    id: 'serverless',
    name: 'Serverless',
    category: 'Cloud',
    image: poster('serverless functions landscape')
  },
  {
    id: 'observability',
    name: 'Observability',
    category: 'DevOps',
    image: poster('observability tracing logs metrics landscape')
  },

  // Data & ML Ops
  {
    id: 'data-eng',
    name: 'Data Engineering',
    category: 'Data',
    image: poster('data pipelines airflow dbt landscape'),
    featured: true
  },
  {
    id: 'analytics',
    name: 'Product Analytics',
    category: 'Data',
    image: poster('product analytics charts landscape')
  },
  {
    id: 'sql',
    name: 'SQL & PostgreSQL',
    category: 'Data',
    image: poster('sql postgres performance landscape')
  },
  {
    id: 'mlops',
    name: 'MLOps',
    category: 'Data',
    image: poster('mlops model lifecycle landscape')
  },

  // Design & Product
  {
    id: 'ui-ux',
    name: 'UI/UX',
    category: 'Design',
    image: poster('ui ux clean interface landscape')
  },
  {
    id: 'design-systems',
    name: 'Design Systems',
    category: 'Design',
    image: poster('design systems tokens landscape')
  },
  {
    id: 'product-management',
    name: 'Product Management',
    category: 'Product',
    image: poster('product roadmap prioritization landscape'),
    featured: true
  },

  // Marketing
  { id: 'seo', name: 'SEO', category: 'Marketing', image: poster('seo growth serp landscape') },
  {
    id: 'content-marketing',
    name: 'Content Marketing',
    category: 'Marketing',
    image: poster('content strategy storytelling landscape')
  },
  {
    id: 'social-media',
    name: 'Social Media',
    category: 'Marketing',
    image: poster('social media campaigns landscape')
  },
  {
    id: 'paid-ads',
    name: 'Paid Ads',
    category: 'Marketing',
    image: poster('paid performance marketing landscape')
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing',
    category: 'Marketing',
    image: poster('email marketing lifecycle landscape')
  },
  {
    id: 'marketing-ops',
    name: 'Marketing Ops',
    category: 'Marketing',
    image: poster('marketing ops automation landscape')
  },
  {
    id: 'marketing-analytics',
    name: 'Marketing Analytics',
    category: 'Marketing',
    image: poster('marketing analytics dashboards landscape')
  },

  // Sales
  {
    id: 'sales-outbound',
    name: 'Outbound Prospecting',
    category: 'Sales',
    image: poster('sales outbound prospecting landscape'),
    featured: true
  },
  {
    id: 'sdr',
    name: 'SDR Tactics',
    category: 'Sales',
    image: poster('sdr tactics cadence landscape')
  },
  {
    id: 'cold-email',
    name: 'Cold Email',
    category: 'Sales',
    image: poster('cold email copy deliverability landscape')
  },
  {
    id: 'discovery',
    name: 'Discovery & Qualification',
    category: 'Sales',
    image: poster('sales discovery qualification landscape')
  },
  {
    id: 'demos',
    name: 'Demos & Storytelling',
    category: 'Sales',
    image: poster('product demos storytelling landscape')
  },
  {
    id: 'negotiation',
    name: 'Negotiation',
    category: 'Sales',
    image: poster('negotiation deals landscape')
  },
  {
    id: 'pricing-sales',
    name: 'Pricing Strategy',
    category: 'Sales',
    image: poster('pricing strategy value landscape')
  },
  {
    id: 'revops',
    name: 'RevOps & CRM',
    category: 'Sales',
    image: poster('revops crm pipeline landscape')
  },

  // Freelance & Business
  {
    id: 'freelancing',
    name: 'Freelancing 101',
    category: 'Freelance',
    image: poster('freelancing solo business landscape'),
    featured: true
  },
  {
    id: 'client-acquisition',
    name: 'Client Acquisition',
    category: 'Freelance',
    image: poster('client acquisition leads landscape')
  },
  {
    id: 'portfolio',
    name: 'Portfolio & Case Studies',
    category: 'Freelance',
    image: poster('portfolio case studies landscape')
  },
  {
    id: 'pricing-freelance',
    name: 'Pricing & Packaging',
    category: 'Freelance',
    image: poster('pricing packaging freelance landscape')
  },
  {
    id: 'contracts',
    name: 'Contracts & Proposals',
    category: 'Freelance',
    image: poster('contracts proposals landscape')
  },
  {
    id: 'platforms',
    name: 'Upwork & Marketplaces',
    category: 'Freelance',
    image: poster('upwork marketplaces gigs landscape')
  },
  {
    id: 'personal-brand',
    name: 'Personal Brand',
    category: 'Freelance',
    image: poster('personal brand linkedin twitter landscape')
  },
  {
    id: 'networking',
    name: 'Networking & Partnerships',
    category: 'Freelance',
    image: poster('networking partnerships landscape')
  },
  {
    id: 'remote-work',
    name: 'Remote Work',
    category: 'Freelance',
    image: poster('remote work productivity landscape')
  },
  {
    id: 'productivity',
    name: 'Productivity',
    category: 'Freelance',
    image: poster('productivity focus systems landscape')
  },

  // Entrepreneurship
  {
    id: 'saas',
    name: 'SaaS & PLG',
    category: 'Business',
    image: poster('saas plg growth landscape'),
    featured: true
  },
  {
    id: 'bootstrapping',
    name: 'Bootstrapping',
    category: 'Business',
    image: poster('bootstrapping indiehackers landscape')
  },
  {
    id: 'fundraising',
    name: 'Fundraising',
    category: 'Business',
    image: poster('fundraising venture angels landscape')
  }
];
