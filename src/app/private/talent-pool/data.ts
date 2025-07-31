export interface Talent {
  id: string;
  name: string;
  title: string;
  description: string;
  avatarSrc?: string;
  initials?: string;
  isTeam?: boolean;
  tags: string[];
  endorsements: number;
  availability: 'available' | 'busy';
  availabilityUntil?: string;
}

export const talentData: Talent[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'Security & Authentication Expert',
    description:
      'Specialized in API security, authentication systems, and secure integration patterns for enterprise applications. 7+ years of experience in e-commerce security.',
    avatarSrc: '/placeholder.svg?height=40&width=40',
    tags: ['API Security', 'OAuth', 'JWT', 'Node.js'],
    endorsements: 18,
    availability: 'available'
  },
  {
    id: '2',
    name: 'Alex Johnson',
    title: 'Cloud Architecture',
    description:
      'AWS-certified solutions architect specializing in scalable API architectures, serverless computing, and cloud-native applications. Experience with high-volume e-commerce...',
    avatarSrc: '/placeholder.svg?height=40&width=40',
    tags: ['AWS', 'API Gateway', 'Serverless', 'Microservices'],
    endorsements: 24,
    availability: 'available'
  },
  {
    id: '3',
    name: 'Digital Wizards',
    title: 'Full-stack Development',
    description:
      "A team of 5 full-stack developers specialized in building enterprise-grade API integration platforms. We've completed 20+ projects for e-commerce and fintech...",
    initials: 'DW',
    isTeam: true,
    tags: ['API Development', 'Node.js', 'React', 'GraphQL'],
    endorsements: 31,
    availability: 'busy',
    availabilityUntil: 'June'
  },
  {
    id: '4',
    name: 'Maria Rodriguez',
    title: 'Data Scientist',
    description:
      'Expert in machine learning, data analysis, and predictive modeling. Proven track record in optimizing business processes and driving data-driven decisions.',
    avatarSrc: '/placeholder.svg?height=40&width=40',
    tags: ['Python', 'Machine Learning', 'SQL', 'Data Visualization'],
    endorsements: 15,
    availability: 'available'
  },
  {
    id: '5',
    name: 'Creative Minds',
    title: 'UI/UX Design Agency',
    description:
      'A collective of award-winning UI/UX designers focused on creating intuitive and visually appealing digital experiences. Specializing in mobile and web applications.',
    initials: 'CM',
    isTeam: true,
    tags: ['UI Design', 'UX Research', 'Figma', 'Prototyping'],
    endorsements: 45,
    availability: 'busy',
    availabilityUntil: 'August'
  },
  {
    id: '6',
    name: 'John Doe',
    title: 'DevOps Engineer',
    description:
      'Experienced DevOps engineer with a strong background in CI/CD pipelines, infrastructure as code, and cloud automation. Passionate about streamlining development workflows.',
    avatarSrc: '/placeholder.svg?height=40&width=40',
    tags: ['Docker', 'Kubernetes', 'Terraform', 'Azure'],
    endorsements: 20,
    availability: 'available'
  }
];
