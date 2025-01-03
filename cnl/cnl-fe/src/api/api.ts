import { environment } from "../environments/environments";
import { ChatMessage, GoogleProfile, User } from "../types/types";

// !! TODO
const baseUrl = `${environment.app.backendUrl}/api`;

// todo: refactor to smaller functions
export const apiClient = {
  // test
  pingBackend: async (): Promise<{ message: string }> => {
    const response = await fetch(`${baseUrl}/ping`, {
      credentials: 'include', 
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  },

  getDynamoDBTables: async (): Promise<string[]> => {
    const response = await fetch(`${baseUrl}/aws/dynamodb/tables`, {
      credentials: 'include', 
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  },

  addTestData: async (testData: { randomId: string; message: string }): Promise<{ message: string }> => {
    const response = await fetch(`${baseUrl}/test/add`, {
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

  
  /**
   * get user profile from auth service
   * 
   * @returns userProfile
   */
  getProfile: async (): Promise<GoogleProfile> => {
    const response = await fetch(`${baseUrl}/auth/profile`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  },

/**
 * Message to GPT and back
 * @param message 
 * @returns 
 */
  sendMessageToGPT: async (message: string): Promise<{ response: string }> => {
    const response = await fetch(`${baseUrl}/openai/send-to-gpt`, {
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

  /**
   * Get user by email - dynamodb
   * @param email 
   * @returns 
   */
  getUserByEmail: async (email: string): Promise<User | null> => {
    const response = await fetch(`${baseUrl}/user/get-by-email?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;  // Return null if the user is not found
      } 
        throw new Error(`Error: ${response.statusText}`);
      
    }

    return response.json();
  },

  /**
   * Update user profile - dynamodb
   * @param profile 
   */
  updateUserProfile: async (profile: User): Promise<void> => {
    const response = await fetch(`${baseUrl}/user/update-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
  },
  
/**
 * Get messages by userId from DynamoDB
 * @param userId - The user's ID
 * @returns An array of ChatMessage objects
 */
getMessagesByUserId: async (userId: string): Promise<ChatMessage[]> => {
  const response = await fetch(`${baseUrl}/messages/get-by-user?userId=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching messages: ${response.statusText}`);
  }

  return response.json();
},

  /**
   * Save a message to DynamoDB
   * @param message - The chat message object to save
   */
  saveMessage: async (message: ChatMessage): Promise<void> => {
    const response = await fetch(`${baseUrl}/messages/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Error saving message: ${response.statusText}`);
    }
  },
};
