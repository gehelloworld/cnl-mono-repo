import { useEffect } from "react";
import { useRecoilState } from "recoil";

import { apiClient } from "../api/api";
import profileImage from '../assets/images/profile-img.png'; 
import { userProfileState } from "../recoil/Object.recoil";
import { useUserState } from "../utils/userHelpers";
import ChatInterface from "./ChatInterface";

const ProfilePage: React.FC = () => {
  const { error, isLoading } = useUserState();
  const [user] = useRecoilState(userProfileState);

 useEffect(() => {
  if (user?.userId) {
    apiClient.updateUserProfile(user);
  }
 }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching profile data</div>;
   
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    {/* Main container */}
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg flex flex-col h-[90vh] p-8 space-y-6">
      {/* Profile image and name */}
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden">
          <img
            src={user?.profilePicture}
            alt={profileImage}
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-3xl font-semibold mb-2">Hello, {user?.firstName}</h1>
      </div>

      {/* Divider Line */}
      <div className="w-full h-1 bg-gray-200" />

      {/* Chat interface */}
      <div className="flex-grow overflow-auto">
    <ChatInterface />
  </div>
    </div>
  </div>
);
};
  
  export default ProfilePage;