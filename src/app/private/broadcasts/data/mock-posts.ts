import { BroadcastPost } from '../types';

export const generateMockPosts = (): BroadcastPost[] => {
  const authors = [
    {
      name: 'Sarah Chen',
      handle: '@sarahchen',
      avatar: 'https://i.pravatar.cc/150?img=1',
      verified: true
    },
    {
      name: 'Marcus Rodriguez',
      handle: '@marcusr',
      avatar: 'https://i.pravatar.cc/150?img=2',
      verified: false
    },
    {
      name: 'Dr. Emily Watson',
      handle: '@emilytech',
      avatar: 'https://i.pravatar.cc/150?img=3',
      verified: true
    },
    {
      name: 'Alex Turner',
      handle: '@alexdesigns',
      avatar: 'https://i.pravatar.cc/150?img=4',
      verified: false
    },
    {
      name: 'Lisa Park',
      handle: '@lisamarketing',
      avatar: 'https://i.pravatar.cc/150?img=5',
      verified: true
    },
    {
      name: 'David Kim',
      handle: '@daviddev',
      avatar: 'https://i.pravatar.cc/150?img=6',
      verified: true
    },
    {
      name: 'Elena Rodriguez',
      handle: '@elenauxui',
      avatar: 'https://i.pravatar.cc/150?img=7',
      verified: false
    },
    {
      name: 'Michael Chang',
      handle: '@miketech',
      avatar: 'https://i.pravatar.cc/150?img=8',
      verified: true
    }
  ];

  const posts: BroadcastPost[] = [
    // 1. Short Video Post
    {
      id: 'post_1',
      type: 'video',
      title: 'Quick React Tip: Custom Hooks in 60 Seconds',
      content: 'Here\'s a lightning-fast overview of creating your first custom React hook. Perfect for beginners who want to level up their React skills!',
      author: authors[0],
      timestamp: '2 hours ago',
      tags: ['React', 'JavaScript', 'Custom Hooks', 'Tutorial'],
      category: 'Development',
      priority: 'high',
      readTime: 1,
      isTrending: true,
      shareUrl: 'https://wingman.dev/broadcasts/post/post_1',
      subcast: {
        id: 'dev-quicktips',
        name: 'Dev Quick Tips',
        icon: 'solar:lightbulb-linear'
      },
      media: {
        type: 'video',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800',
        duration: '0:58',
        aspectRatio: 'portrait',
        isShort: true
      },
      engagement: { likes: 1247, comments: 89, shares: 156, bookmarks: 234, views: 12580 }
    },

    // 2. Image Gallery Post
    {
      id: 'post_2',
      type: 'gallery',
      title: 'UI Design Inspiration: Modern Dashboard Collection',
      content: 'A curated collection of the most beautiful dashboard designs I\'ve seen this month. Each one showcases different approaches to data visualization and user experience. Swipe through to see various color palettes, layouts, and interaction patterns.',
      author: authors[3],
      timestamp: '4 hours ago',
      tags: ['UI Design', 'Dashboard', 'Inspiration', 'UX'],
      category: 'Design',
      priority: 'normal',
      readTime: 5,
      isTrending: true,
      shareUrl: 'https://wingman.dev/broadcasts/post/post_2',
      subcast: {
        id: 'design-inspiration',
        name: 'Design Inspiration',
        icon: 'solar:palette-linear'
      },
      media: {
        type: 'gallery',
        url: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
          'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800',
          'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
          'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800'
        ],
        aspectRatio: 'landscape'
      },
      engagement: { likes: 892, comments: 67, shares: 145, bookmarks: 312, views: 5670 }
    },

    // 3. Landscape Video Post
    {
      id: 'post_3',
      type: 'video',
      title: 'Building a Full-Stack App with Next.js 14 and Supabase',
      content: 'In this comprehensive tutorial, I\'ll walk you through building a complete full-stack application using the latest Next.js 14 features and Supabase for the backend. We\'ll cover authentication, database design, real-time subscriptions, and deployment strategies.',
      author: authors[5],
      timestamp: '6 hours ago',
      tags: ['Next.js', 'Supabase', 'Full Stack', 'Tutorial', 'Authentication'],
      category: 'Development',
      priority: 'high',
      readTime: 25,
      isTrending: true,
      shareUrl: 'https://wingman.dev/broadcasts/post/post_3',
      subcast: {
        id: 'fullstack-dev',
        name: 'Full Stack Development',
        icon: 'solar:code-square-linear'
      },
      media: {
        type: 'video',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        duration: '24:30',
        aspectRatio: 'landscape'
      },
      engagement: { likes: 2156, comments: 178, shares: 289, bookmarks: 567, views: 18940 }
    },

    // 4. Single Portrait Image
    {
      id: 'post_4',
      type: 'image',
      title: 'Mobile-First Design: The Future is Vertical',
      content: 'This mobile interface concept explores how we can better utilize vertical screen real estate. The design features a card-based layout with smooth animations and intuitive gestures. Notice how the navigation adapts to thumb-friendly zones and the content hierarchy guides the user\'s attention naturally.',
      author: authors[6],
      timestamp: '8 hours ago',
      tags: ['Mobile Design', 'UI/UX', 'Vertical Layout', 'Touch Interface'],
      category: 'Design',
      priority: 'normal',
      readTime: 3,
      isTrending: false,
      shareUrl: 'https://wingman.dev/broadcasts/post/post_4',
      subcast: {
        id: 'mobile-design',
        name: 'Mobile Design',
        icon: 'solar:smartphone-linear'
      },
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600',
        aspectRatio: 'portrait'
      },
      engagement: { likes: 634, comments: 45, shares: 78, bookmarks: 156, views: 3421 }
    },

    // 5. Poll Post
    {
      id: 'post_5',
      type: 'poll',
      title: 'Which Frontend Framework Will Dominate 2024?',
      content: 'The frontend landscape is constantly evolving. Based on recent developments, community adoption, and performance improvements, which framework do you think will have the biggest impact this year? Share your thoughts in the comments!',
      author: authors[7],
      timestamp: '10 hours ago',
      tags: ['Frontend', 'Framework', 'React', 'Vue', 'Angular', 'Svelte'],
      category: 'Development',
      priority: 'normal',
      readTime: 2,
      isTrending: true,
      shareUrl: 'https://wingman.dev/broadcasts/post/post_5',
      subcast: {
        id: 'tech-polls',
        name: 'Tech Polls',
        icon: 'solar:chart-2-linear'
      },
      poll: {
        question: 'Which frontend framework will dominate 2024?',
        options: [
          { id: 'react', text: 'React', votes: 1247, percentage: 45 },
          { id: 'vue', text: 'Vue.js', votes: 692, percentage: 25 },
          { id: 'angular', text: 'Angular', votes: 415, percentage: 15 },
          { id: 'svelte', text: 'Svelte', votes: 277, percentage: 10 },
          { id: 'other', text: 'Other', votes: 138, percentage: 5 }
        ],
        totalVotes: 2769,
        userVoted: 'react',
        endsAt: 'in 2 days'
      },
      engagement: { likes: 456, comments: 234, shares: 123, bookmarks: 89, views: 8934 }
    },

    // 6. Quote Post
    {
      id: 'post_6',
      type: 'quote',
      title: 'On the Nature of Innovation',
      content: 'Innovation is not about saying yes to everything. It\'s about saying no to all but the most crucial features.',
      author: authors[1],
      timestamp: '12 hours ago',
      tags: ['Innovation', 'Product Management', 'Steve Jobs', 'Philosophy'],
      category: 'Business',
      priority: 'low',
      readTime: 1,
      isTrending: false,
      shareUrl: 'https://wingman.dev/broadcasts/post/post_6',
      subcast: {
        id: 'daily-wisdom',
        name: 'Daily Wisdom',
        icon: 'solar:quote-down-linear'
      },
      engagement: { likes: 789, comments: 56, shares: 234, bookmarks: 145, views: 4567 }
    },

    // 7. Link Post
    {
      id: 'post_7',
      type: 'link',
      title: 'The Complete Guide to CSS Grid Layout',
      content: 'This comprehensive guide covers everything you need to know about CSS Grid. From basic concepts to advanced techniques, learn how to create complex layouts with minimal code. Includes interactive examples and real-world use cases.',
      author: authors[2],
      timestamp: '14 hours ago',
      tags: ['CSS', 'Grid Layout', 'Web Development', 'Frontend'],
      category: 'Development',
      priority: 'normal',
      readTime: 15,
      isTrending: false,
      shareUrl: 'https://wingman.dev/broadcasts/post/post_7',
      subcast: {
        id: 'css-mastery',
        name: 'CSS Mastery',
        icon: 'solar:code-linear'
      },
      link: {
        url: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
        title: 'A Complete Guide to CSS Grid | CSS-Tricks',
        description: 'Our comprehensive guide to CSS grid, focusing on all the settings both for the grid parent container and the grid child elements.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        domain: 'css-tricks.com'
      },
      engagement: { likes: 543, comments: 78, shares: 167, bookmarks: 289, views: 6789 }
    },

    // 8. Article Post with Landscape Image
    {
      id: 'post_8',
      type: 'article',
      title: 'The Psychology of Color in User Interface Design',
      content: 'Colors have a profound impact on user behavior and emotions. In this deep dive, we explore how different colors affect user perception, decision-making, and overall user experience. From the calming effect of blues to the urgency conveyed by reds, understanding color psychology can dramatically improve your design decisions.',
      author: authors[4],
      timestamp: '16 hours ago',
      tags: ['Color Psychology', 'UI Design', 'User Experience', 'Visual Design'],
      category: 'Design',
      priority: 'high',
      readTime: 12,
      isTrending: true,
      shareUrl: 'https://wingman.dev/broadcasts/post/post_8',
      subcast: {
        id: 'design-psychology',
        name: 'Design Psychology',
        icon: 'solar:brain-linear'
      },
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        aspectRatio: 'landscape'
      },
      engagement: { likes: 1134, comments: 145, shares: 234, bookmarks: 456, views: 9876 }
    },

    // 9. Square Image Post
    {
      id: 'post_9',
      type: 'image',
      title: 'Minimalist Logo Design: Less is More',
      content: 'This logo concept demonstrates the power of simplicity. Using just geometric shapes and negative space, we created a memorable brand mark that works across all mediums. The design process involved 50+ iterations to achieve this level of refinement.',
      author: authors[3],
      timestamp: '18 hours ago',
      tags: ['Logo Design', 'Minimalism', 'Branding', 'Graphic Design'],
      category: 'Design',
      priority: 'normal',
      readTime: 4,
      isTrending: false,
      shareUrl: 'https://wingman.dev/broadcasts/post/post_9',
      subcast: {
        id: 'logo-design',
        name: 'Logo Design',
        icon: 'solar:medal-star-linear'
      },
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
        aspectRatio: 'square'
      },
      engagement: { likes: 678, comments: 34, shares: 89, bookmarks: 167, views: 3456 }
    },

    // 10. Text-only Article
    {
      id: 'post_10',
      type: 'article',
      title: 'The Rise of Micro-Interactions in Modern Web Design',
      content: 'Micro-interactions are the subtle animations and feedback mechanisms that make digital products feel alive and responsive. They guide users through interfaces, provide feedback for actions, and create delightful moments that enhance the overall user experience. From a simple button hover effect to complex loading animations, these small details have become essential elements of modern web design. This post explores the psychology behind micro-interactions, best practices for implementation, and how they contribute to user engagement and satisfaction.',
      author: authors[0],
      timestamp: '20 hours ago',
      tags: ['Micro-interactions', 'Web Design', 'Animation', 'User Experience'],
      category: 'Design',
      priority: 'normal',
      readTime: 8,
      isTrending: false,
      shareUrl: 'https://wingman.dev/broadcasts/post/post_10',
      subcast: {
        id: 'web-design-trends',
        name: 'Web Design Trends',
        icon: 'solar:widget-4-linear'
      },
      engagement: { likes: 445, comments: 67, shares: 123, bookmarks: 234, views: 5432 }
    },

    // 11. Collection of Code Screenshots
    {
      id: 'post_11',
      type: 'gallery',
      title: 'Clean Code Examples: Before vs After Refactoring',
      content: 'Code refactoring is an art form. Here are 5 real-world examples of messy code transformed into clean, maintainable solutions. Each example shows the original problematic code and the improved version with explanations of what changed and why.',
      author: authors[5],
      timestamp: '22 hours ago',
      tags: ['Clean Code', 'Refactoring', 'Best Practices', 'Code Quality'],
      category: 'Development',
      priority: 'high',
      readTime: 10,
      isTrending: true,
      shareUrl: 'https://wingman.dev/broadcasts/post/post_11',
      subcast: {
        id: 'clean-code',
        name: 'Clean Code',
        icon: 'solar:code-circle-linear'
      },
      media: {
        type: 'gallery',
        url: [
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
          'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800',
          'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
        ],
        aspectRatio: 'landscape'
      },
      engagement: { likes: 1567, comments: 234, shares: 345, bookmarks: 678, views: 12345 }
    },

    // 12. Another Short Video
    {
      id: 'post_12',
      type: 'video',
      title: 'CSS Animation Magic: Morphing Shapes',
      content: 'Watch this mesmerizing CSS-only animation that transforms a simple circle into complex geometric patterns using nothing but keyframes and clever transforms. No JavaScript required!',
      author: authors[6],
      timestamp: '1 day ago',
      tags: ['CSS Animation', 'Motion Design', 'Creative Coding', 'Frontend'],
      category: 'Development',
      priority: 'normal',
      readTime: 2,
      isTrending: false,
      shareUrl: 'https://wingman.dev/broadcasts/post/post_12',
      subcast: {
        id: 'css-animations',
        name: 'CSS Animations',
        icon: 'solar:play-circle-linear'
      },
      media: {
        type: 'video',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        duration: '1:45',
        aspectRatio: 'portrait',
        isShort: true
      },
      engagement: { likes: 892, comments: 45, shares: 156, bookmarks: 234, views: 7890 }
    }
  ];

  return posts;
};

export const generateMockComments = (postId: string) => {
  const commentAuthors = [
    {
      name: 'John Smith',
      avatar: 'https://i.pravatar.cc/150?img=10',
      verified: false,
      handle: '@johnsmith'
    },
    {
      name: 'Maria Garcia',
      avatar: 'https://i.pravatar.cc/150?img=11',
      verified: true,
      handle: '@mariagarcia'
    },
    {
      name: 'Chris Johnson',
      avatar: 'https://i.pravatar.cc/150?img=12',
      verified: false,
      handle: '@chrisjohnson'
    }
  ];

  return [
    {
      id: `${postId}_comment_1`,
      author: commentAuthors[0],
      content: 'This is exactly what I was looking for! Thanks for sharing such detailed insights.',
      timestamp: '2 hours ago',
      votes: { upvotes: 12, downvotes: 1, userVote: 'up' as const },
      isPinned: true,
      replies: [
        {
          id: `${postId}_comment_1_reply_1`,
          author: commentAuthors[1],
          content: 'Completely agree! The examples really help clarify the concepts.',
          timestamp: '1 hour ago',
          votes: { upvotes: 5, downvotes: 0, userVote: null }
        }
      ]
    },
    {
      id: `${postId}_comment_2`,
      author: commentAuthors[2],
      content: 'Great post! Have you considered covering the performance implications in a follow-up?',
      timestamp: '3 hours ago',
      votes: { upvotes: 8, downvotes: 2, userVote: null },
      replies: []
    }
  ];
};
