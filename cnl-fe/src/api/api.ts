import { User } from "../types/types";

// api.ts
const BASE_URL = 'http://localhost:4000/api';

// todo: refactor to smaller functions
export const apiClient = {
  pingBackend: async (): Promise<{ message: string }> => {
    const response = await fetch(`${BASE_URL}/ping`, {
      credentials: 'include', // Include cookies for session handling
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  },

  getProfile: async (): Promise<any> => {
    const response = await fetch(`${BASE_URL}/auth/profile`, {
      credentials: 'include', // Include cookies for session handling
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  },

  
  sendMessageToGPT: async (message: string): Promise<{ response: string }> => {
    const response = await fetch(`${BASE_URL}/openai/send-to-gpt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  },

  getDynamoDBTables: async (): Promise<string[]> => {
    const response = await fetch(`${BASE_URL}/aws/dynamodb/tables`, {
      credentials: 'include', 
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  },

  getUserByEmail: async (email: string): Promise<User | null> => {
    const response = await fetch(`${BASE_URL}/user/get-by-email?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for session handling
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;  // Return null if the user is not found
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
    }

    return response.json();
  },

  updateUserProfile: async (profile: User): Promise<void> => {
    const response = await fetch(`${BASE_URL}/user/update-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
      credentials: 'include', // Include cookies for session handling
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
  },

  //test table
  addTestData: async (testData: { randomId: string; message: string }): Promise<{ message: string }> => {
    const response = await fetch(`${BASE_URL}/test/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  },
};
