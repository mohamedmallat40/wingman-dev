// import type { Metadata } from 'next';

// import {
//   ArrowRight,
//   Briefcase,
//   Calendar,
//   CheckCircle2,
//   Clock,
//   Download,
//   Globe,
//   GraduationCap,
//   Languages,
//   Linkedin,
//   Mail,
//   MapPin,
//   Phone
// } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';

// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';

// const user = {
//   id: '60d7aaba-f366-4a1c-85ff-f99d64497aee',
//   email: 'mohamedmallat40@gmail.com',
//   kind: 'FREELANCER',
//   userName: null as string | null,
//   firstName: 'Mohamed',
//   lastName: 'Mallat',
//   resume: 'Mohamed-Mallat-FlowCV-LTS-d96e.pdf',
//   aboutMe:
//     '<p><span style="color: rgb(19,32,29);background-color: rgb(255,255,255);font-size: 10.5;font-family: Open Sans, serif;">Highly skilled with JavaScript ecosystem with over five years of professional experience on various projects. I<br>contribute to the design, implementation, and deployment of Web/Mobile applications using mainly JS<br>technologies as well as others such as REST APIs, Docker, NGINX etc.</span>&nbsp;</p>\n',
//   profileImage: 'WhatsAppImage2024-11-10at01-9213.jpg',
//   profileCover: null as string | null,
//   statusAviability: 'OPEN_FOR_PART_TIME',
//   phoneNumber: '+21658891477',
//   linkedinProfile: 'https://www.linkedin.com/in/mohamed-mallat-64192a107/',
//   profileWebsite: 'https://www.linkedin.com/in/mohamed-mallat-64192a107/',
//   profession: 'FULL_TIME_FREELANCER',
//   workType: 'REMOTE',
//   workingTime: 'PART_TIME',
//   experienceYears: 5, // derived from narrative
//   language: 'EN',
//   skills: [
//     { key: 'NodeJS' },
//     { key: 'TypeScript' },
//     { key: 'MySQL' },
//     { key: 'PostgreSQL' },
//     { key: 'Gitlab-CI' },
//     { key: 'Nginx' }
//   ],
//   experiences: [
//     {
//       company: 'UP WORK',
//       position: 'Full-Stack Web developer',
//       description:
//         'Almost 5 years freelancing on Upwork across full-stack JavaScript projects. Strong collaboration and delivery.',
//       startDate: '2018-11-12',
//       endDate: '2020-11-12'
//     },
//     {
//       company: 'Proxym-IT',
//       position: 'Full-Stack Web Developer',
//       description:
//         'Full-stack (Angular, NestJs). Worked on international projects with designers and UX to deliver high-quality apps.',
//       startDate: '2020-11-12',
//       endDate: '2022-11-12'
//     },
//     {
//       company: 'DNEXT',
//       position: 'NodeJs Developer',
//       description:
//         'Optimized commodities data using ElasticSearch, AWS Lambdas/EventBridge; DBs: Snowflake, DynamoDB, RDS.',
//       startDate: '2022-11-12',
//       endDate: '2023-11-12'
//     },
//     {
//       company: 'ALWASAET (Aramco, Remote)',
//       position: 'Senior Node.js developer',
//       description:
//         'Integrated Directus (Flows, permissions), built NodeJS services, optimized Postgres queries and data access.',
//       startDate: '2023-11-12',
//       endDate: null
//     }
//   ],
//   languages: [
//     { key: 'EN', level: 'PROFESSIONAL' },
//     { key: 'AR', level: 'NATIVE' },
//     { key: 'FR', level: 'INTERMEDIATE' }
//   ],
//   education: [
//     {
//       university: 'EPI - International Multidisciplinary School',
//       degree: 'Software engineering',
//       description:
//         'Programming languages, algorithms, data structures, software testing, project management, methodologies.',
//       startDate: '2019-11-12',
//       endDate: '2022-11-12'
//     }
//   ]
// };

// const fullName = `${user.firstName} ${user.lastName}`;
// const usernameSlug = 'mohamed-mallat';
// const description =
//   'Senior Node.js and Full-Stack JavaScript engineer. Remote-first freelancer with experience across NodeJS, TypeScript, Angular/NestJS, Directus, Postgres, AWS, ElasticSearch, and CI/CD.';
// const keywords = [
//   'Mohamed Mallat',
//   'Node.js',
//   'TypeScript',
//   'Full-Stack',
//   'PostgreSQL',
//   'MySQL',
//   'Directus',
//   'AWS',
//   'ElasticSearch',
//   'Remote',
//   'Freelancer',
//   'JavaScript',
//   'Next.js',
//   'API'
// ];

// export const metadata: Metadata = {
//   title: `${fullName} — Senior Node.js & Full-Stack Engineer`,
//   description,
//   keywords,
//   alternates: {
//     canonical: `/mohamed-mallat`
//   },
//   openGraph: {
//     title: `${fullName} — Senior Node.js & Full-Stack Engineer`,
//     description,
//     type: 'profile',
//     url: `/mohamed-mallat`,
//     images: [
//       {
//         url: `/placeholder.svg?height=630&width=1200&query=Open+Graph+image+for+Mohamed+Mallat+professional+profile`,
//         width: 1200,
//         height: 630,
//         alt: 'Open Graph image for Mohamed Mallat profile'
//       }
//     ]
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: `${fullName} — Senior Node.js & Full-Stack Engineer`,
//     description,
//     images: [
//       `/placeholder.svg?height=630&width=1200&query=Twitter+card+image+for+Mohamed+Mallat+profile`
//     ]
//   }
// };

// function formatDate(input: string | null) {
//   if (!input) return 'Present';
//   try {
//     const date = new Date(input);
//     return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
//   } catch {
//     return input ?? '';
//   }
// }

// export default function Page() {
//   const structuredData = {
//     '@context': 'https://schema.org',
//     '@type': 'Person',
//     name: fullName,
//     email: `mailto:${user.email}`,
//     telephone: user.phoneNumber,
//     jobTitle: 'Senior Node.js & Full-Stack Engineer',
//     url: `/mohamed-mallat`,
//     sameAs: [user.linkedinProfile, user.profileWebsite].filter(Boolean),
//     image: `/placeholder.svg?height=320&width=320&query=Professional+headshot+avatar+for+Mohamed+Mallat`,
//     worksFor: user.experiences.map((exp) => ({
//       '@type': 'Organization',
//       name: exp.company
//     })),
//     knowsAbout: user.skills.map((s) => s.key.trim()),
//     address: {
//       '@type': 'PostalAddress',
//       addressLocality: 'Remote',
//       addressRegion: 'Global'
//     },
//     availability: user.statusAviability?.toLowerCase().replaceAll('_', ' ')
//   };

//   return (
//     <main
//       aria-labelledby='page-title'
//       className='min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-zinc-900 dark:to-zinc-950'
//     >
//       <script
//         type='application/ld+json'
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
//       />

//       {/* Hero */}
//       <section className='relative'>
//         <div className='absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-100px,rgba(59,130,246,0.12),transparent)] dark:bg-[radial-gradient(1200px_600px_at_50%_-100px,rgba(59,130,246,0.18),transparent)]' />
//         <div className='container mx-auto px-4 pt-10 pb-8 sm:pt-14'>
//           <nav className='mb-6 flex flex-wrap items-center justify-between gap-3'>
//             <Link
//               href='/'
//               className='text-muted-foreground hover:text-foreground text-sm transition-colors'
//               aria-label='Back to home'
//             >
//               {'← Back'}
//             </Link>
//             <div className='flex items-center gap-2'>
//               <Badge variant='secondary' className='rounded-full px-3 py-1'>
//                 {user.kind}
//               </Badge>
//               <Badge className='bg-primary/10 text-primary hover:bg-primary/20 rounded-full px-3 py-1'>
//                 {user.statusAviability?.replaceAll('_', ' ') ?? 'Available'}
//               </Badge>
//             </div>
//           </nav>

//           <Card className='overflow-hidden border-0 shadow-md ring-1 ring-black/5 dark:ring-white/10'>
//             <div className='relative h-28 w-full bg-[linear-gradient(135deg,rgba(59,130,246,0.15),transparent),linear-gradient(45deg,rgba(56,189,248,0.12),transparent)] sm:h-36 dark:bg-[linear-gradient(135deg,rgba(59,130,246,0.25),transparent),linear-gradient(45deg,rgba(56,189,248,0.2),transparent)]' />
//             <CardContent className='relative -mt-10 p-4 sm:-mt-12 sm:p-6'>
//               <div className='flex flex-col gap-4 sm:flex-row sm:items-end'>
//                 <Avatar className='size-20 shadow-md ring-4 ring-white sm:size-24 dark:ring-zinc-900'>
//                   <AvatarImage
//                     src={`/placeholder.svg?height=192&width=192&query=Professional+headshot+avatar+for+Mohamed+Mallat`}
//                     alt='Profile photo of Mohamed Mallat'
//                   />
//                   <AvatarFallback>MM</AvatarFallback>
//                 </Avatar>
//                 <div className='flex-1'>
//                   <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
//                     <div>
//                       <h1
//                         id='page-title'
//                         className='text-2xl font-semibold tracking-tight sm:text-3xl'
//                       >
//                         {fullName}
//                       </h1>
//                       <p className='text-muted-foreground mt-1'>
//                         Senior Node.js & Full-Stack JavaScript Engineer · {user.workType} ·{' '}
//                         {user.workingTime.replaceAll('_', ' ')}
//                       </p>
//                     </div>
//                     <div className='flex flex-wrap gap-2'>
//                       <Button asChild className='rounded-full'>
//                         <a href={`mailto:${user.email}`} aria-label='Email Mohamed'>
//                           <Mail className='mr-2 size-4' />
//                           Contact
//                         </a>
//                       </Button>
//                       <Button asChild variant='outline' className='rounded-full'>
//                         <a href={`tel:${user.phoneNumber}`} aria-label='Call Mohamed'>
//                           <Phone className='mr-2 size-4' />
//                           {user.phoneNumber}
//                         </a>
//                       </Button>
//                       <Button asChild variant='ghost' className='rounded-full'>
//                         <a
//                           href={user.linkedinProfile}
//                           target='_blank'
//                           rel='noopener noreferrer'
//                           aria-label='LinkedIn profile'
//                         >
//                           <Linkedin className='mr-2 size-4' />
//                           LinkedIn
//                         </a>
//                       </Button>
//                       <Button asChild variant='ghost' className='rounded-full'>
//                         <a
//                           href={user.profileWebsite}
//                           target='_blank'
//                           rel='noopener noreferrer'
//                           aria-label='Personal website'
//                         >
//                           <Globe className='mr-2 size-4' />
//                           Website
//                         </a>
//                       </Button>
//                     </div>
//                   </div>
//                   <div className='text-muted-foreground mt-3 flex flex-wrap items-center gap-3 text-sm'>
//                     <span className='inline-flex items-center gap-1'>
//                       <CheckCircle2 className='size-4 text-green-500' aria-hidden />
//                       {'Mail verified'}
//                     </span>
//                     <span className='inline-flex items-center gap-1'>
//                       <Clock className='size-4' aria-hidden />
//                       {'Experience: ~5 years'}
//                     </span>
//                     <span className='inline-flex items-center gap-1'>
//                       <MapPin className='size-4' aria-hidden />
//                       {'Remote'}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <Separator className='my-6' />

//               {/* In-page nav */}
//               <div className='flex flex-wrap gap-2 text-sm'>
//                 {[
//                   { href: '#about', label: 'About' },
//                   { href: '#experience', label: 'Experience' },
//                   { href: '#skills', label: 'Skills' },
//                   { href: '#languages', label: 'Languages' },
//                   { href: '#education', label: 'Education' },
//                   { href: '#contact', label: 'Contact' }
//                 ].map((item) => (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className='bg-background text-muted-foreground hover:text-foreground hover:bg-accent rounded-full border px-3 py-1 transition-colors'
//                   >
//                     {item.label}
//                   </Link>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </section>

//       {/* Content Sections */}
//       <section className='container mx-auto px-4 pb-16'>
//         <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
//           {/* Left column */}
//           <div className='space-y-6 lg:col-span-2'>
//             {/* About */}
//             <Card id='about' className='scroll-mt-24'>
//               <CardHeader>
//                 <CardTitle>About</CardTitle>
//                 <CardDescription>Who I am and what I do</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div
//                   className='prose prose-slate dark:prose-invert max-w-none leading-relaxed'
//                   // Content is authored by the user; in a real app, sanitize HTML.
//                   dangerouslySetInnerHTML={{ __html: user.aboutMe }}
//                 />
//               </CardContent>
//             </Card>

//             {/* Experience */}
//             <Card id='experience' className='scroll-mt-24'>
//               <CardHeader>
//                 <CardTitle>Experience</CardTitle>
//                 <CardDescription>Selected roles and achievements</CardDescription>
//               </CardHeader>
//               <CardContent className='space-y-8'>
//                 <ol className='border-border/60 relative ms-3 border-s'>
//                   {user.experiences.map((exp, idx) => (
//                     <li key={`${exp.company}-${idx}`} className='ms-6 mb-8'>
//                       <span className='bg-primary/10 text-primary ring-background absolute -start-3 flex size-6 items-center justify-center rounded-full ring-2'>
//                         <Briefcase className='size-3.5' aria-hidden />
//                       </span>
//                       <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
//                         <h3 className='font-medium'>
//                           {exp.position} · <span className='text-foreground/80'>{exp.company}</span>
//                         </h3>
//                         <div className='text-muted-foreground inline-flex items-center gap-1 text-sm'>
//                           <Calendar className='size-4' aria-hidden />
//                           <span>
//                             {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
//                           </span>
//                         </div>
//                       </div>
//                       <p className='text-muted-foreground mt-2'>{exp.description}</p>
//                     </li>
//                   ))}
//                 </ol>
//               </CardContent>
//             </Card>

//             {/* Education */}
//             <Card id='education' className='scroll-mt-24'>
//               <CardHeader>
//                 <CardTitle>Education</CardTitle>
//                 <CardDescription>Academic background</CardDescription>
//               </CardHeader>
//               <CardContent className='space-y-6'>
//                 {user.education.map((edu, idx) => (
//                   <div
//                     key={`${edu.university}-${idx}`}
//                     className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'
//                   >
//                     <div>
//                       <h3 className='font-medium'>{edu.university}</h3>
//                       <p className='text-muted-foreground'>{edu.degree}</p>
//                       <p className='text-muted-foreground mt-2 text-sm'>{edu.description}</p>
//                     </div>
//                     <div className='text-muted-foreground inline-flex items-center gap-1 text-sm'>
//                       <GraduationCap className='size-4' aria-hidden />
//                       <span>
//                         {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right column */}
//           <div className='space-y-6'>
//             {/* Skills */}
//             <Card id='skills' className='scroll-mt-24'>
//               <CardHeader>
//                 <CardTitle>Skills</CardTitle>
//                 <CardDescription>Core technologies</CardDescription>
//               </CardHeader>
//               <CardContent className='flex flex-wrap gap-2'>
//                 {user.skills.map((s, i) => (
//                   <Badge
//                     key={`${s.key}-${i}`}
//                     className='bg-primary/10 text-primary hover:bg-primary/20 rounded-full'
//                   >
//                     {s.key.trim()}
//                   </Badge>
//                 ))}
//               </CardContent>
//             </Card>

//             {/* Languages */}
//             <Card id='languages' className='scroll-mt-24'>
//               <CardHeader>
//                 <CardTitle>Languages</CardTitle>
//                 <CardDescription>Spoken and written</CardDescription>
//               </CardHeader>
//               <CardContent className='space-y-3'>
//                 {user.languages.map((lang, i) => (
//                   <div key={`${lang.key}-${i}`} className='flex items-center justify-between'>
//                     <div className='flex items-center gap-2'>
//                       <Languages className='text-muted-foreground size-4' aria-hidden />
//                       <span className='font-medium'>{lang.key}</span>
//                     </div>
//                     <span className='text-muted-foreground text-sm'>{lang.level}</span>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>

//             {/* Contact & Resume */}
//             <Card id='contact' className='scroll-mt-24'>
//               <CardHeader>
//                 <CardTitle>Work with {user.firstName}</CardTitle>
//                 <CardDescription>Available for part-time, remote engagements</CardDescription>
//               </CardHeader>
//               <CardContent className='space-y-4'>
//                 <div className='flex flex-col gap-2 text-sm'>
//                   <div className='flex items-center gap-2'>
//                     <Mail className='text-muted-foreground size-4' aria-hidden />
//                     <a className='hover:underline' href={`mailto:${user.email}`}>
//                       {user.email}
//                     </a>
//                   </div>
//                   <div className='flex items-center gap-2'>
//                     <Phone className='text-muted-foreground size-4' aria-hidden />
//                     <a className='hover:underline' href={`tel:${user.phoneNumber}`}>
//                       {user.phoneNumber}
//                     </a>
//                   </div>
//                   <div className='flex items-center gap-2'>
//                     <Linkedin className='text-muted-foreground size-4' aria-hidden />
//                     <a
//                       className='hover:underline'
//                       href={user.linkedinProfile}
//                       target='_blank'
//                       rel='noopener noreferrer'
//                     >
//                       {user.linkedinProfile}
//                     </a>
//                   </div>
//                 </div>
//                 <div className='flex flex-wrap gap-2'>
//                   <Button asChild className='rounded-full'>
//                     <a href={`mailto:${user.email}`}>
//                       {"Let's talk"}
//                       <ArrowRight className='ml-2 size-4' aria-hidden />
//                     </a>
//                   </Button>
//                   <Button asChild variant='outline' className='rounded-full'>
//                     {/* Replace with your hosted CV path when available */}
//                     <a href={user.profileWebsite} target='_blank' rel='noopener noreferrer'>
//                       <Download className='mr-2 size-4' aria-hidden />
//                       View CV
//                     </a>
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Profile card (compact) */}
//             <Card aria-label='Profile quick info'>
//               <CardHeader className='flex flex-row items-center gap-3'>
//                 <Avatar className='size-12'>
//                   <AvatarImage
//                     src={`/placeholder.svg?height=96&width=96&query=Avatar+for+Mohamed+Mallat`}
//                     alt='Avatar'
//                   />
//                   <AvatarFallback>MM</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <CardTitle className='text-base'>{fullName}</CardTitle>
//                   <CardDescription>Senior Node.js & Full-Stack</CardDescription>
//                 </div>
//               </CardHeader>
//               <CardContent className='text-muted-foreground text-sm'>
//                 Building scalable backends, reliable APIs, and product-focused frontends with modern
//                 JS/TS stacks.
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className='bg-background border-t'>
//         <div className='text-muted-foreground container mx-auto px-4 py-8 text-sm'>
//           <div className='flex flex-col items-center justify-between gap-3 sm:flex-row'>
//             <p>
//               © {new Date().getFullYear()} {fullName}. All rights reserved.
//             </p>
//             <div className='flex items-center gap-3'>
//               <Link
//                 className='hover:text-foreground'
//                 href={`mailto:${user.email}`}
//                 aria-label='Email'
//               >
//                 <Mail className='size-4' />
//               </Link>
//               <Link
//                 className='hover:text-foreground'
//                 href={`tel:${user.phoneNumber}`}
//                 aria-label='Phone'
//               >
//                 <Phone className='size-4' />
//               </Link>
//               <Link
//                 className='hover:text-foreground'
//                 href={user.linkedinProfile}
//                 target='_blank'
//                 rel='noopener noreferrer'
//                 aria-label='LinkedIn'
//               >
//                 <Linkedin className='size-4' />
//               </Link>
//               <Link
//                 className='hover:text-foreground'
//                 href={user.profileWebsite}
//                 target='_blank'
//                 rel='noopener noreferrer'
//                 aria-label='Website'
//               >
//                 <Globe className='size-4' />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </main>
//   );
// }
