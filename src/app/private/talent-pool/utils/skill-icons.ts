// Comprehensive skill icons mapping for popular skills - modern outlined style
export const skillIcons: Record<string, string> = {
  // Frontend Development
  'react': 'solar:code-linear',
  'vue': 'solar:code-linear',
  'angular': 'solar:code-linear',
  'javascript': 'solar:code-linear',
  'typescript': 'solar:code-linear',
  'html': 'solar:code-linear',
  'css': 'solar:palette-2-linear',
  'sass': 'solar:palette-2-linear',
  'tailwind': 'solar:palette-2-linear',
  'bootstrap': 'solar:palette-2-linear',
  'jquery': 'solar:code-linear',
  'nextjs': 'solar:code-linear',
  'nuxt': 'solar:code-linear',
  'svelte': 'solar:code-linear',

  // Backend Development
  'nodejs': 'solar:server-linear',
  'python': 'solar:code-square-linear',
  'java': 'solar:code-square-linear',
  'php': 'solar:server-linear',
  'c#': 'solar:code-square-linear',
  'go': 'solar:code-square-linear',
  'rust': 'solar:code-square-linear',
  'ruby': 'solar:code-square-linear',
  'kotlin': 'solar:smartphone-linear',
  'swift': 'solar:smartphone-linear',
  'scala': 'solar:code-square-linear',
  'laravel': 'solar:server-linear',
  'django': 'solar:server-linear',
  'flask': 'solar:server-linear',
  'spring': 'solar:server-linear',
  'express': 'solar:server-linear',

  // Databases
  'mysql': 'solar:database-linear',
  'postgresql': 'solar:database-linear',
  'mongodb': 'solar:database-linear',
  'redis': 'solar:database-linear',
  'sqlite': 'solar:database-linear',
  'firebase': 'solar:cloud-linear',
  'supabase': 'solar:cloud-linear',

  // Cloud & DevOps
  'aws': 'solar:cloud-linear',
  'azure': 'solar:cloud-linear',
  'google cloud': 'solar:cloud-linear',
  'docker': 'solar:box-linear',
  'kubernetes': 'solar:settings-minimalistic-linear',
  'jenkins': 'solar:settings-linear',
  'gitlab': 'solar:branch-linear',
  'github': 'solar:branch-linear',
  'git': 'solar:branch-linear',
  'terraform': 'solar:settings-linear',

  // Design Tools
  'figma': 'solar:palette-linear',
  'sketch': 'solar:palette-linear',
  'adobe xd': 'solar:palette-linear',
  'photoshop': 'solar:image-linear',
  'illustrator': 'solar:palette-linear',
  'indesign': 'solar:document-linear',
  'after effects': 'solar:video-frame-linear',
  'premiere pro': 'solar:video-frame-linear',

  // Marketing & Analytics
  'google analytics': 'solar:chart-linear',
  'google ads': 'solar:megaphone-linear',
  'facebook ads': 'solar:megaphone-linear',
  'mailchimp': 'solar:letter-linear',
  'hubspot': 'solar:chart-linear',
  'salesforce': 'solar:chart-linear',

  // Office & Productivity
  'microsoft office': 'solar:document-linear',
  'excel': 'solar:file-text-linear',
  'word': 'solar:document-text-linear',
  'powerpoint': 'solar:presentation-graph-linear',
  'google sheets': 'solar:file-text-linear',
  'notion': 'solar:notebook-linear',
  'slack': 'solar:chat-round-linear',
  'trello': 'solar:list-check-linear',
  'jira': 'solar:bug-linear',
  'asana': 'solar:list-check-linear',

  // Mobile Development
  'react native': 'solar:smartphone-linear',
  'flutter': 'solar:smartphone-linear',
  'ionic': 'solar:smartphone-linear',
  'xamarin': 'solar:smartphone-linear',

  // Data & AI
  'machine learning': 'solar:cpu-linear',
  'artificial intelligence': 'solar:cpu-linear',
  'data science': 'solar:chart-square-linear',
  'tensorflow': 'solar:cpu-linear',
  'pytorch': 'solar:cpu-linear',
  'r': 'solar:chart-square-linear',
  'tableau': 'solar:chart-linear',
  'power bi': 'solar:chart-linear',

  // CMS & E-commerce
  'wordpress': 'solar:global-linear',
  'shopify': 'solar:shop-linear',
  'magento': 'solar:shop-linear',
  'drupal': 'solar:global-linear',
  'woocommerce': 'solar:shop-linear',

  // Testing
  'jest': 'solar:bug-linear',
  'cypress': 'solar:bug-linear',
  'selenium': 'solar:bug-linear',

  // Generic fallback icons by category
  'frontend': 'solar:code-linear',
  'backend': 'solar:server-linear',
  'fullstack': 'solar:code-2-linear',
  'mobile': 'solar:smartphone-linear',
  'design': 'solar:palette-linear',
  'marketing': 'solar:chart-linear',
  'data': 'solar:chart-square-linear',
  'devops': 'solar:settings-linear',
  'project management': 'solar:list-check-linear',
  'communication': 'solar:chat-round-linear',
  'leadership': 'solar:crown-linear',
  'strategy': 'solar:target-linear',
  'analytics': 'solar:graph-linear',
  'seo': 'solar:magnifer-linear',
  'content': 'solar:document-text-linear',
  'social media': 'solar:share-linear',
  'copywriting': 'solar:pen-linear',
  'branding': 'solar:star-linear',
  'photography': 'solar:camera-linear',
  'video editing': 'solar:video-frame-linear',
  'animation': 'solar:play-linear',
  'ui/ux': 'solar:user-linear',
  'web development': 'solar:global-linear',
  'api': 'solar:link-linear',
  'database': 'solar:database-linear',
  'security': 'solar:shield-check-linear',
  'testing': 'solar:bug-linear',
  'agile': 'solar:refresh-linear',
  'scrum': 'solar:users-group-two-rounded-linear'
};

// Function to get skill icon with fallback
export const getSkillIcon = (skillName: string): string => {
  const normalizedSkill = skillName.toLowerCase().trim();
  
  // Direct match
  if (skillIcons[normalizedSkill]) {
    return skillIcons[normalizedSkill];
  }
  
  // Partial match for compound skills
  for (const [key, icon] of Object.entries(skillIcons)) {
    if (normalizedSkill.includes(key) || key.includes(normalizedSkill)) {
      return icon;
    }
  }
  
  // Category-based fallback
  if (normalizedSkill.includes('react') || normalizedSkill.includes('vue') || normalizedSkill.includes('angular')) {
    return skillIcons.frontend!;
  }
  
  if (normalizedSkill.includes('node') || normalizedSkill.includes('python') || normalizedSkill.includes('java') || normalizedSkill.includes('php')) {
    return skillIcons.backend!;
  }
  
  if (normalizedSkill.includes('design') || normalizedSkill.includes('ui') || normalizedSkill.includes('ux')) {
    return skillIcons.design!;
  }
  
  if (normalizedSkill.includes('marketing') || normalizedSkill.includes('seo') || normalizedSkill.includes('ads')) {
    return skillIcons.marketing!;
  }
  
  if (normalizedSkill.includes('data') || normalizedSkill.includes('analytics') || normalizedSkill.includes('analysis')) {
    return skillIcons.data!;
  }
  
  if (normalizedSkill.includes('mobile') || normalizedSkill.includes('ios') || normalizedSkill.includes('android')) {
    return skillIcons.mobile!;
  }
  
  if (normalizedSkill.includes('project') || normalizedSkill.includes('management') || normalizedSkill.includes('agile')) {
    return skillIcons['project management']!;
  }
  
  // Default fallback icon
  return 'solar:star-linear';
};