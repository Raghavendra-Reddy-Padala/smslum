// This is a mock Firebase implementation for demonstration purposes
// In a real application, you would use the actual Firebase SDK

export const auth = {
  signInWithEmailAndPassword: async (email: string, password: string) => {
    // Simulate authentication
    return { user: { uid: "user123", email } }
  },
  createUserWithEmailAndPassword: async (email: string, password: string) => {
    // Simulate user creation
    return { user: { uid: "user123", email } }
  },
  signOut: async () => {
    // Simulate sign out
    return true
  },
}

export const firestore = {
  collection: (name: string) => ({
    add: async (data: any) => {
      // Simulate adding document
      return { id: "doc123" }
    },
    doc: (id: string) => ({
      get: async () => ({
        exists: true,
        data: () => ({ ...data, id }),
      }),
      update: async (newData: any) => {
        // Simulate updating document
        return true
      },
      delete: async () => {
        // Simulate deleting document
        return true
      },
    }),
    where: (field: string, operator: string, value: any) => ({
      get: async () => ({
        empty: false,
        docs: [
          {
            id: "doc123",
            data: () => ({ id: "doc123", title: "Mock Document" }),
          },
        ],
      }),
    }),
  }),
}

export const storage = {
  ref: (path: string) => ({
    put: async (file: File) => {
      // Simulate file upload
      return {
        ref: {
          getDownloadURL: async () => "https://example.com/image.jpg",
        },
      }
    },
  }),
}

// Mock data
const data = {
  complaints: [
    {
      id: "complaint1",
      title: "Water Leakage",
      description: "There is a water leakage in the main pipeline near Block C.",
      status: "processing",
      priority: "high",
      date: "2023-03-15",
    },
  ],
  users: [
    {
      id: "user123",
      name: "John Doe",
      email: "john@example.com",
    },
  ],
}

