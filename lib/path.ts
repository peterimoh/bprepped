export const Path = {
  Admin: {
    Root: '/admin',
  },
  Client: {
    Root: '/',
    Auth: {
      Login: '/login',
      Signup: '/signup',
      ForgotPassword: '/forgot-password',
      PasswordReset: '/password-reset',
    },
    Protected: {
      Root: '/dashboard',
      Builder: '/builder',
      Experiences: '/experiences',
      Interview: {
        Root: '/interview',
        New: '/interview/new',
        Session: '/interview/session',
      },
      Profile: '/profile',
      Resumes: '/resumes',
      Scanner: {
        Root: '/scanner',
        New: '/scanner/new',
      },
      Settings: '/settings',
      Templates: '/templates',
      Tokens: '/tokens',
      Usage: '/usage',
    },
  },
};

// Helper function to create dynamic paths
export const createPath = {
  // Builder with ID
  builder: (id: string) => `${Path.Client.Protected.Builder}/${id}`,

  // Interview session with query params
  interviewSession: (job: string, interviewer: string) =>
    `${Path.Client.Protected.Interview.Session}?job=${encodeURIComponent(job)}&interviewer=${interviewer}`,
};
