export const API_ROUTES = {
  auth: {
    login: '/auth/local/signin',
    register: '/auth/local/signup',
    subscriptions: '/subscription',
    checkValidEUVAT: '/invoices/validate-vat'
  },
  profile: {
    me: '/users/me',
    image: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://dev.extraexpertise.be/api'}/upload/`,
    experience: '/experience/byUser/',
    educationByUser: '/education/byUser/',
    education: '/education',
    services: '/services/user/',
    languages: '/languages/byUser/',
    reviews: '/public-reviews/'
  }
};
