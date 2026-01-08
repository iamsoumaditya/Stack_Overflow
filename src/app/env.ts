const env = {
  appwrite: {
    endpoint: String(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL),
    projectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
    projectName: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_NAME),
    apikey: String(process.env.APPWRITE_API_KEY),
  },
};

export default env