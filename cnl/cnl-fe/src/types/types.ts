// as cnl-be src/types/index.ts
export interface User {
    userId: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    accessToken: string;
    firstLogin: string;
    lastLogin: string;
  }
  
  export interface ChatMessage {
    msgId: string;
    userId: string;
    sender: 'user' | 'bot';
    message: string;
    timestamp: string;
  }
  
  export interface GoogleProfile {
    profile: {
      email: string;
      firstName: string;
      lastName: string;
      profilePicture: string;
      accessToken: string;
    };
  }