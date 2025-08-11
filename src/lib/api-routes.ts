export const API_ROUTES = {
  auth: {
    login: '/auth/local/signin',
    register: '/auth/local/signup',
    subscriptions: '/subscription',
    checkValidEUVAT: '/invoices/validate-vat',
    completeProfile: '/auth/complete-account'
  },
  profile: {
    me: '/users/me',
    userProfile: '/users/',
    image: '/upload/',
    experience: '/experience',
    experienceByUser: '/experience/byUser/',
    educationByUser: '/education/byUser/',
    education: '/education',
    services: '/services',
    servicesByUser: '/services/user/',
    languages: '/languages',
    languagesByUser: '/languages/byUser/',
    reviews: '/public-reviews/',
    skills: '/skills',
    address: '/address'
  },
  documents: {
    personal: '/documents',
    shared: '/documents/shared',
    types: '/documents/types',
    share: '/documents',
    delete: '/documents'
  },
  network: {
    myNetwork: '/network/my-network'
  },
  upload: {
    single: '/upload'
  }
};
