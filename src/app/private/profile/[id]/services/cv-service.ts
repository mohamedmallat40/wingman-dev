import wingManApi from '@/lib/axios';

export interface ParsedCVData {
  personalInfo: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedIn?: string;
    website?: string;
    summary?: string;
  };
  skills: Array<{
    name: string;
    category: string;
    level?: string;
    years?: number;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    grade?: string;
    location?: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    location?: string;
    description: string;
    responsibilities: string[];
  }>;
  languages: Array<{
    name: string;
    level: string;
    proficiency?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    startDate?: string;
    endDate?: string;
    url?: string;
  }>;
}

export class CVService {
  static async parseCV(file: File): Promise<ParsedCVData> {
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const response = await wingManApi.post('/cv/parse', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error parsing CV:', error);
      throw new Error('Failed to parse CV');
    }
  }

  static async applyCVData(data: Partial<ParsedCVData>): Promise<void> {
    try {
      await wingManApi.post('/profile/apply-cv-data', data);
    } catch (error) {
      console.error('Error applying CV data:', error);
      throw new Error('Failed to apply CV data to profile');
    }
  }

  static getMockCVData(): ParsedCVData {
    return {
      personalInfo: {
        firstName: 'Alexandra',
        lastName: 'Rodriguez',
        email: 'alexandra.rodriguez@email.com',
        phone: '+1 (555) 987-6543',
        location: 'New York, NY',
        linkedIn: 'https://linkedin.com/in/alexandra-rodriguez',
        website: 'https://alexrodriguez.dev',
        summary: 'Senior Full-Stack Engineer with 8+ years of experience building scalable web applications and leading development teams. Expertise in modern JavaScript frameworks, cloud architecture, and agile methodologies. Passionate about clean code, user experience, and mentoring junior developers. Successfully delivered 50+ projects with measurable business impact.'
      },
      skills: [
        { name: 'JavaScript', category: 'Programming', level: 'Expert', years: 8 },
        { name: 'TypeScript', category: 'Programming', level: 'Expert', years: 6 },
        { name: 'React', category: 'Frontend', level: 'Expert', years: 7 },
        { name: 'Next.js', category: 'Frontend', level: 'Advanced', years: 5 },
        { name: 'Vue.js', category: 'Frontend', level: 'Advanced', years: 4 },
        { name: 'Node.js', category: 'Backend', level: 'Expert', years: 6 },
        { name: 'Express.js', category: 'Backend', level: 'Advanced', years: 5 },
        { name: 'Python', category: 'Programming', level: 'Advanced', years: 4 },
        { name: 'Django', category: 'Backend', level: 'Intermediate', years: 3 },
        { name: 'PostgreSQL', category: 'Database', level: 'Advanced', years: 6 },
        { name: 'MongoDB', category: 'Database', level: 'Advanced', years: 5 },
        { name: 'Redis', category: 'Database', level: 'Intermediate', years: 3 },
        { name: 'AWS', category: 'Cloud', level: 'Advanced', years: 5 },
        { name: 'Google Cloud', category: 'Cloud', level: 'Intermediate', years: 3 },
        { name: 'Docker', category: 'DevOps', level: 'Advanced', years: 4 },
        { name: 'Kubernetes', category: 'DevOps', level: 'Intermediate', years: 2 },
        { name: 'GraphQL', category: 'Backend', level: 'Advanced', years: 3 },
        { name: 'REST APIs', category: 'Backend', level: 'Expert', years: 7 },
        { name: 'Git', category: 'DevOps', level: 'Expert', years: 8 },
        { name: 'CI/CD', category: 'DevOps', level: 'Advanced', years: 4 },
        { name: 'Agile/Scrum', category: 'Soft', level: 'Expert', years: 6 },
        { name: 'Team Leadership', category: 'Soft', level: 'Advanced', years: 4 },
        { name: 'Project Management', category: 'Soft', level: 'Advanced', years: 5 },
        { name: 'Problem Solving', category: 'Soft', level: 'Expert', years: 8 },
        { name: 'Communication', category: 'Soft', level: 'Expert', years: 8 }
      ],
      experience: [
        {
          company: 'TechFlow Solutions',
          position: 'Senior Full-Stack Engineer & Team Lead',
          startDate: '2022-03-01',
          endDate: '',
          location: 'New York, NY',
          description: 'Lead a team of 6 developers building enterprise-grade web applications. Architected and implemented microservices infrastructure serving 500K+ daily active users. Drove technical decisions and mentored junior developers.',
          responsibilities: [
            'Led development of React-based dashboard serving 500K+ users',
            'Architected microservices infrastructure using Node.js and Docker',
            'Implemented CI/CD pipelines reducing deployment time by 70%',
            'Mentored 6 junior developers and conducted technical interviews',
            'Collaborated with product managers to define technical requirements',
            'Optimized application performance resulting in 40% faster load times',
            'Established coding standards and best practices for the team',
            'Managed technical debt and refactoring initiatives'
          ]
        },
        {
          company: 'InnovateTech Inc.',
          position: 'Full-Stack Developer',
          startDate: '2020-01-01',
          endDate: '2022-02-01',
          location: 'San Francisco, CA',
          description: 'Developed and maintained multiple web applications using React, Node.js, and cloud technologies. Worked closely with cross-functional teams to deliver high-quality software solutions.',
          responsibilities: [
            'Built responsive web applications using React and TypeScript',
            'Developed RESTful APIs and GraphQL endpoints using Node.js',
            'Integrated third-party services including payment gateways and analytics',
            'Implemented automated testing with Jest and Cypress',
            'Participated in agile development processes and sprint planning',
            'Collaborated with UX/UI designers to implement pixel-perfect designs',
            'Monitored application performance and implemented optimizations'
          ]
        },
        {
          company: 'StartupVenture',
          position: 'Frontend Developer',
          startDate: '2018-06-01',
          endDate: '2019-12-01',
          location: 'Remote',
          description: 'Built the frontend for a revolutionary fintech application from the ground up. Worked in a fast-paced startup environment with rapid iteration and deployment cycles.',
          responsibilities: [
            'Developed responsive React application from initial concept',
            'Implemented state management using Redux and Context API',
            'Created reusable component library used across multiple projects',
            'Integrated with backend APIs and handled real-time data updates',
            'Optimized application for mobile devices and various screen sizes',
            'Participated in user testing sessions and implemented feedback'
          ]
        },
        {
          company: 'Digital Agency Pro',
          position: 'Junior Web Developer',
          startDate: '2016-08-01',
          endDate: '2018-05-01',
          location: 'Boston, MA',
          description: 'Started my career developing websites and web applications for various clients. Gained experience in multiple technologies and learned best practices in web development.',
          responsibilities: [
            'Built custom WordPress themes and plugins for client websites',
            'Developed interactive web applications using jQuery and vanilla JavaScript',
            'Collaborated with designers to implement responsive web designs',
            'Maintained and updated existing client websites',
            'Provided technical support and troubleshooting for client issues',
            'Learned modern development tools and version control systems'
          ]
        }
      ],
      education: [
        {
          institution: 'Massachusetts Institute of Technology',
          degree: 'Master of Science',
          field: 'Computer Science',
          startDate: '2014-09-01',
          endDate: '2016-06-01',
          grade: '3.9 GPA',
          location: 'Cambridge, MA'
        },
        {
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          field: 'Computer Engineering',
          startDate: '2010-09-01',
          endDate: '2014-06-01',
          grade: 'Magna Cum Laude, 3.7 GPA',
          location: 'Berkeley, CA'
        }
      ],
      languages: [
        { name: 'English', level: 'Native', proficiency: 'Native speaker' },
        { name: 'Spanish', level: 'Professional', proficiency: 'C1 - Professional working proficiency' },
        { name: 'French', level: 'Intermediate', proficiency: 'B2 - Upper intermediate' },
        { name: 'Portuguese', level: 'Beginner', proficiency: 'A2 - Elementary' }
      ],
      certifications: [
        {
          name: 'AWS Certified Solutions Architect - Professional',
          issuer: 'Amazon Web Services',
          issueDate: '2023-05-15',
          expiryDate: '2026-05-15',
          credentialId: 'AWS-SAP-2023-789456'
        },
        {
          name: 'Google Cloud Professional Cloud Architect',
          issuer: 'Google Cloud',
          issueDate: '2023-02-20',
          expiryDate: '2025-02-20',
          credentialId: 'GCP-PCA-2023-456789'
        },
        {
          name: 'Certified Kubernetes Administrator (CKA)',
          issuer: 'Cloud Native Computing Foundation',
          issueDate: '2022-11-10',
          expiryDate: '2025-11-10',
          credentialId: 'CKA-2022-123789'
        },
        {
          name: 'MongoDB Certified Developer Associate',
          issuer: 'MongoDB Inc.',
          issueDate: '2022-08-05',
          expiryDate: '2025-08-05',
          credentialId: 'MDB-DEV-2022-987654'
        },
        {
          name: 'Professional Scrum Master I',
          issuer: 'Scrum.org',
          issueDate: '2021-03-12',
          expiryDate: '',
          credentialId: 'PSM-I-2021-654321'
        }
      ],
      projects: [
        {
          name: 'E-Commerce Microservices Platform',
          description: 'Built a comprehensive e-commerce platform using microservices architecture. Features include user management, product catalog, order processing, payment integration, and real-time inventory tracking. Serves 100K+ monthly active users.',
          technologies: ['React', 'Node.js', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Stripe'],
          startDate: '2023-01-01',
          endDate: '2023-08-01',
          url: 'https://github.com/alexrodriguez/ecommerce-microservices'
        },
        {
          name: 'Real-Time Collaboration Tool',
          description: 'Developed a Slack-like collaboration platform with real-time messaging, file sharing, video calls, and project management features. Built with modern web technologies and WebSocket for real-time communication.',
          technologies: ['Next.js', 'Socket.io', 'PostgreSQL', 'Prisma', 'WebRTC', 'AWS S3'],
          startDate: '2022-09-01',
          endDate: '2023-02-01',
          url: 'https://collaborate-pro.alexrodriguez.dev'
        },
        {
          name: 'AI-Powered Analytics Dashboard',
          description: 'Created an advanced analytics dashboard with machine learning insights, data visualization, and predictive analytics. Integrated multiple data sources and provided actionable business intelligence.',
          technologies: ['Vue.js', 'Python', 'Django', 'TensorFlow', 'D3.js', 'PostgreSQL'],
          startDate: '2022-04-01',
          endDate: '2022-10-01',
          url: 'https://analytics-ai.alexrodriguez.dev'
        },
        {
          name: 'Mobile-First Progressive Web App',
          description: 'Built a mobile-first PWA for a food delivery service with offline capabilities, push notifications, and location-based services. Achieved 98% Lighthouse performance score.',
          technologies: ['React', 'Service Workers', 'IndexedDB', 'Geolocation API', 'Push API'],
          startDate: '2021-11-01',
          endDate: '2022-04-01',
          url: 'https://foodie-pwa.alexrodriguez.dev'
        },
        {
          name: 'Blockchain Voting System',
          description: 'Designed and implemented a secure blockchain-based voting system with smart contracts, ensuring transparency and immutability of votes. Built for academic research and proof of concept.',
          technologies: ['Solidity', 'Web3.js', 'Ethereum', 'React', 'MetaMask'],
          startDate: '2021-06-01',
          endDate: '2021-11-01',
          url: 'https://github.com/alexrodriguez/blockchain-voting'
        }
      ]
    };
  }
}
