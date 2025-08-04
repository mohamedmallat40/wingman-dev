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
  rating?: number;
  hourlyRate?: string;
  location?: string;
  countryCode?: string;
  completedProjects?: number;
  languages?: string[];
  timezone?: string;
}

export const talentData: Talent[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'Security & Authentication Expert',
    description:
      'Specialized in API security, authentication systems, and secure integration patterns for enterprise applications. 7+ years of experience in e-commerce security.',
    avatarSrc: '/placeholder.svg?height=40&width=40',
    tags: ['API Security', 'OAuth', 'JWT', 'Node.js', 'Cybersecurity', 'Encryption'],
    endorsements: 18,
    availability: 'available',
    rating: 4.9,
    hourlyRate: '$85/hr',
    location: 'San Francisco, CA',
    countryCode: 'US',
    completedProjects: 45,
    languages: ['English', 'Mandarin'],
    timezone: 'PST'
  },
  {
    id: '2',
    name: 'Alex Johnson',
    title: 'Cloud Architecture Specialist',
    description:
      'AWS-certified solutions architect specializing in scalable API architectures, serverless computing, and cloud-native applications. Experience with high-volume e-commerce platforms.',
    avatarSrc: '/placeholder.svg?height=40&width=40',
    tags: ['AWS', 'API Gateway', 'Serverless', 'Microservices', 'Docker', 'Kubernetes'],
    endorsements: 24,
    availability: 'available',
    rating: 4.8,
    hourlyRate: '$95/hr',
    location: 'Seattle, WA',
    countryCode: 'US',
    completedProjects: 62,
    languages: ['English'],
    timezone: 'PST'
  },
  {
    id: '3',
    name: 'Digital Wizards',
    title: 'Full-stack Development Team',
    description:
      "A team of 5 full-stack developers specialized in building enterprise-grade API integration platforms. We've completed 20+ projects for e-commerce and fintech companies.",
    initials: 'DW',
    isTeam: true,
    tags: ['API Development', 'Node.js', 'React', 'GraphQL', 'TypeScript', 'MongoDB'],
    endorsements: 31,
    availability: 'busy',
    availabilityUntil: 'June',
    rating: 4.7,
    hourlyRate: '$120/hr',
    location: 'New York, NY',
    countryCode: 'US',
    completedProjects: 89,
    languages: ['English', 'Spanish'],
    timezone: 'EST'
  },
  {
    id: '4',
    name: 'Maria Rodriguez',
    title: 'Senior Data Scientist',
    description:
      'Expert in machine learning, data analysis, and predictive modeling. Proven track record in optimizing business processes and driving data-driven decisions for Fortune 500 companies.',
    avatarSrc: '/placeholder.svg?height=40&width=40',
    tags: ['Python', 'Machine Learning', 'SQL', 'Data Visualization', 'TensorFlow', 'R'],
    endorsements: 15,
    availability: 'available',
    rating: 4.6,
    hourlyRate: '$75/hr',
    location: 'Austin, TX',
    countryCode: 'US',
    completedProjects: 32,
    languages: ['English', 'Spanish'],
    timezone: 'CST'
  },
  {
    id: '5',
    name: 'Creative Minds',
    title: 'UI/UX Design Agency',
    description:
      'A collective of award-winning UI/UX designers focused on creating intuitive and visually appealing digital experiences. Specializing in mobile and web applications.',
    initials: 'CM',
    isTeam: true,
    tags: ['UI Design', 'UX Research', 'Figma', 'Prototyping', 'Design Systems', 'Accessibility'],
    endorsements: 45,
    availability: 'busy',
    availabilityUntil: 'August',
    rating: 4.9,
    hourlyRate: '$110/hr',
    location: 'Los Angeles, CA',
    countryCode: 'US',
    completedProjects: 156,
    languages: ['English'],
    timezone: 'PST'
  },
  {
    id: '6',
    name: 'John Doe',
    title: 'Senior DevOps Engineer',
    description:
      'Experienced DevOps engineer with a strong background in CI/CD pipelines, infrastructure as code, and cloud automation. Passionate about streamlining development workflows.',
    avatarSrc: '/placeholder.svg?height=40&width=40',
    tags: ['Docker', 'Kubernetes', 'Terraform', 'Azure', 'CI/CD', 'Jenkins'],
    endorsements: 20,
    availability: 'available',
    rating: 4.7,
    hourlyRate: '$90/hr',
    location: 'Denver, CO',
    countryCode: 'US',
    completedProjects: 38,
    languages: ['English'],
    timezone: 'MST'
  },
  {
    id: '7',
    name: 'Elena Vasquez',
    title: 'Mobile App Developer',
    description:
      'Specialized in cross-platform mobile development using React Native and Flutter. Expert in creating performant, user-friendly mobile applications for iOS and Android.',
    avatarSrc: '/placeholder.svg?height=40&width=40',
    tags: ['React Native', 'Flutter', 'iOS', 'Android', 'Mobile UI', 'App Store'],
    endorsements: 28,
    availability: 'available',
    rating: 4.8,
    hourlyRate: '$80/hr',
    location: 'Miami, FL',
    countryCode: 'US',
    completedProjects: 47,
    languages: ['English', 'Spanish'],
    timezone: 'EST'
  },
  {
    id: '8',
    name: 'Tech Innovators',
    title: 'Blockchain Development Team',
    description:
      'Cutting-edge blockchain development team specializing in DeFi protocols, smart contracts, and Web3 applications. Deep expertise in Ethereum, Solana, and Polygon ecosystems.',
    initials: 'TI',
    isTeam: true,
    tags: ['Blockchain', 'Solidity', 'Web3', 'DeFi', 'Smart Contracts', 'Ethereum'],
    endorsements: 22,
    availability: 'busy',
    availabilityUntil: 'September',
    rating: 4.6,
    hourlyRate: '$150/hr',
    location: 'Silicon Valley, CA',
    countryCode: 'US',
    completedProjects: 29,
    languages: ['English', 'Korean'],
    timezone: 'PST'
  },
  {
    id: '9',
    name: 'David Park',
    title: 'Frontend Architect',
    description:
      'Senior frontend architect with expertise in modern JavaScript frameworks, performance optimization, and scalable frontend architectures. Passionate about creating exceptional user experiences.',
    avatarSrc: '/placeholder.svg?height=40&width=40',
    tags: ['React', 'Vue.js', 'TypeScript', 'Performance', 'Webpack', 'Next.js'],
    endorsements: 35,
    availability: 'available',
    rating: 4.9,
    hourlyRate: '$105/hr',
    location: 'Portland, OR',
    countryCode: 'US',
    completedProjects: 73,
    languages: ['English', 'Korean'],
    timezone: 'PST'
  },
  {
    id: '10',
    name: 'Sophia Williams',
    title: 'Product Manager & Strategy',
    description:
      'Strategic product manager with 8+ years of experience driving product vision and roadmap execution. Expert in agile methodologies, user research, and cross-functional team leadership.',
    avatarSrc: '/placeholder.svg?height=40&width=40',
    tags: ['Product Strategy', 'Agile', 'User Research', 'Roadmapping', 'Analytics', 'Leadership'],
    endorsements: 42,
    availability: 'busy',
    availabilityUntil: 'July',
    rating: 4.8,
    hourlyRate: '$125/hr',
    location: 'Boston, MA',
    countryCode: 'US',
    completedProjects: 67,
    languages: ['English'],
    timezone: 'EST'
  },
  {
    id: '11',
    name: 'Lars Anderson',
    title: 'Backend Engineer',
    description:
      'Expert backend developer with focus on scalable microservices, database optimization, and API design. Specializes in fintech and e-commerce solutions.',
    avatarSrc: '/placeholder.svg?height=40&width=40',
    tags: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Microservices', 'REST APIs'],
    endorsements: 27,
    availability: 'available',
    rating: 4.7,
    hourlyRate: '$88/hr',
    location: 'Stockholm, Sweden',
    countryCode: 'SE',
    completedProjects: 52,
    languages: ['English', 'Swedish', 'Norwegian'],
    timezone: 'CET'
  },
  {
    id: '12',
    name: 'Raj Patel',
    title: 'Machine Learning Engineer',
    description:
      'ML engineer with expertise in computer vision, NLP, and deep learning. Experience building production ML systems for healthcare and autonomous vehicles.',
    avatarSrc: '/placeholder.svg?height=40&width=40',
    tags: ['TensorFlow', 'PyTorch', 'Computer Vision', 'NLP', 'MLOps', 'AWS SageMaker'],
    endorsements: 33,
    availability: 'available',
    rating: 4.8,
    hourlyRate: '$92/hr',
    location: 'Bangalore, India',
    countryCode: 'IN',
    completedProjects: 41,
    languages: ['English', 'Hindi', 'Tamil'],
    timezone: 'IST'
  },
  {
    id: '13',
    name: 'Emma Thompson',
    title: 'Frontend Developer',
    description:
      'Creative frontend developer specializing in React, animation, and responsive design. Passionate about accessibility and user-centric design principles.',
    avatarSrc: '/placeholder.svg?height=40&width=40',
    tags: ['React', 'CSS', 'Animation', 'GSAP', 'Accessibility', 'Responsive Design'],
    endorsements: 19,
    availability: 'available',
    rating: 4.6,
    hourlyRate: '$72/hr',
    location: 'London, UK',
    countryCode: 'GB',
    completedProjects: 36,
    languages: ['English', 'French'],
    timezone: 'GMT'
  },
  {
    id: '14',
    name: 'Global Consulting',
    title: 'Digital Transformation Team',
    description:
      'International consulting team helping Fortune 500 companies with digital transformation initiatives. Expertise in cloud migration, process automation, and technology strategy.',
    initials: 'GC',
    isTeam: true,
    tags: ['Digital Transformation', 'Cloud Migration', 'Strategy', 'Automation', 'Enterprise'],
    endorsements: 67,
    availability: 'busy',
    availabilityUntil: 'November',
    rating: 4.9,
    hourlyRate: '$180/hr',
    location: 'Multiple Locations',
    countryCode: 'CH',
    completedProjects: 134,
    languages: ['English', 'German', 'French'],
    timezone: 'CET'
  },
  {
    id: '15',
    name: 'Yuki Tanaka',
    title: 'Game Developer',
    description:
      'Indie game developer and Unity expert specializing in mobile games, AR/VR experiences, and interactive media. Published multiple successful games on major platforms.',
    avatarSrc: '/placeholder.svg?height=40&width=40',
    tags: ['Unity', 'C#', 'Mobile Games', 'AR/VR', 'Game Design', 'Blender'],
    endorsements: 24,
    availability: 'available',
    rating: 4.7,
    hourlyRate: '$78/hr',
    location: 'Tokyo, Japan',
    countryCode: 'JP',
    completedProjects: 28,
    languages: ['English', 'Japanese'],
    timezone: 'JST'
  }
];
