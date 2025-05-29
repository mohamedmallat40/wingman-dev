
export const API_ROUTES = {
    auth: {
      login: '/auth/local/signin',
      register: '/auth/local/signup',
    },
    profile:{
      me: '/users/me',
      image: (image?: string) =>image ? `${process.env.NEXT_PUBLIC_API_BASE_URL}upload/${image}`:'',
    }

  }
  