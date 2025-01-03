export interface User {
  userId: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  accessToken: string;
  // chatHistory: ChatMessage[];
  firstLogin: string;
  lastLogin: string;
}

export interface UserSession {
  sessionId: string;
  sessionStartTime: string;
  sessionExpiryTime: string;
}

export interface GoogleProfile {
  profile: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    accessToken: string;
  };
}

export type MappedGoogleUser = {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken?: string;
};
