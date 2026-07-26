export const Endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  complaints: {
    list: '/complaints',
    create: '/complaints',
    detail: (id: string) => `/complaints/${id}`,
  },
  sos: {
    trigger: '/sos/trigger',
    cancel: '/sos/cancel',
    guardians: '/sos/guardians',
  },
  map: {
    incidents: '/map/incidents',
    zones: '/map/zones',
  },
} as const;
