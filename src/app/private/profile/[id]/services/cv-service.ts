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
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedIn: 'https://linkedin.com/in/johndoe',
        website: 'https://johndoe.dev',
        summary: 'Experienced software engineer with 5+ years in full-stack development. Passionate about creating scalable web applications and mentoring junior developers.'
      },
      skills: [
        { name: 'JavaScript', category: 'Programming', level: 'Expert', years: 5 },
        { name: 'TypeScript', category: 'Programming', level: 'Expert', years: 4 },
        { name: 'React', category: 'Frontend', level: 'Advanced', years: 4 },
        { name: 'Next.js', category: 'Frontend', level: 'Advanced', years: 3 },
        { name: 'Node.js', category: 'Backend', level: 'Advanced', years: 3 },
        { name: 'Python', category: 'Programming', level: 'Intermediate', years: 2 },
        { name: 'AWS', category: 'Cloud', level: 'Intermediate', years: 2 },
        { name: 'Docker', category: 'DevOps', level: 'Intermediate', years: 2 }
      ],
      experience: [
        {
          company: 'Tech Corp',
          position: 'Senior Software Engineer',
          startDate: '2021-01-01',
          endDate: '2024-01-01',
          location: 'San Francisco, CA',
          description: 'Led development of scalable web applications serving 100K+ users. Architected microservices infrastructure and mentored a team of 5 junior developers.',
          responsibilities: [
            'Built and maintained React-based web applications',
            'Designed RESTful APIs using Node.js and Express',
            'Implemented CI/CD pipelines with GitHub Actions',
            'Mentored junior developers and conducted code reviews',
            'Collaborated with product and design teams on feature planning'
          ]
        },
        {
          company: 'StartupXYZ',
          position: 'Full Stack Developer',
          startDate: '2019-06-01',
          endDate: '2020-12-01',
          location: 'Remote',
          description: 'Developed MVP for a SaaS platform from scratch. Built both frontend and backend components, integrated payment systems, and deployed to production.',
          responsibilities: [
            'Built full-stack application using React and Node.js',
            'Integrated Stripe payment processing',
            'Implemented user authentication and authorization',
            'Deployed and monitored applications on AWS'
          ]
        }
      ],
      education: [
        {
          institution: 'University of Technology',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: '2015-09-01',
          endDate: '2019-06-01',
          grade: '3.8 GPA',
          location: 'San Francisco, CA'
        }
      ],
      languages: [
        { name: 'English', level: 'Native', proficiency: 'Native speaker' },
        { name: 'Spanish', level: 'Intermediate', proficiency: 'B2 - Upper Intermediate' },
        { name: 'French', level: 'Basic', proficiency: 'A2 - Elementary' }
      ],
      certifications: [
        {
          name: 'AWS Certified Developer - Associate',
          issuer: 'Amazon Web Services',
          issueDate: '2023-01-01',
          expiryDate: '2026-01-01',
          credentialId: 'AWS-DEV-123456'
        },
        {
          name: 'Google Cloud Professional Developer',
          issuer: 'Google Cloud',
          issueDate: '2022-06-01',
          expiryDate: '2024-06-01',
          credentialId: 'GCP-DEV-789012'
        }
      ],
      projects: [
        {
          name: 'E-commerce Platform',
          description: 'Built a full-stack e-commerce platform with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, and payment processing.',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
          startDate: '2023-01-01',
          endDate: '2023-06-01',
          url: 'https://github.com/johndoe/ecommerce-platform'
        },
        {
          name: 'Task Management App',
          description: 'Developed a collaborative task management application with real-time updates, file sharing, and team collaboration features.',
          technologies: ['Next.js', 'Socket.io', 'PostgreSQL', 'Prisma'],
          startDate: '2022-08-01',
          endDate: '2022-12-01',
          url: 'https://taskapp.johndoe.dev'
        },
        {
          name: 'Weather Dashboard',
          description: 'Created a responsive weather dashboard with location-based forecasts, interactive maps, and customizable widgets.',
          technologies: ['Vue.js', 'Express.js', 'Redis', 'OpenWeather API'],
          startDate: '2022-03-01',
          endDate: '2022-05-01',
          url: 'https://weather.johndoe.dev'
        }
      ]
    };
  }
}
