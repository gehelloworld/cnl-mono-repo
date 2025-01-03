import React from 'react';

import googleIcon from '../../assets/icons/google-icon.png';  
import { environment } from '../../environments/environments';


export const GoogleLoginButton: React.FC = () => {

  const {backendUrl} = environment.app;

  const handleLogin = () => {
    // -- backend's Google login route
    // !!
    window.location.href = `${backendUrl}/api/auth/google`;  
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-6 rounded flex items-center space-x-2">
      <img src={googleIcon} alt="Google Icon" className="h-5 w-5" />
      <span>Sign in with Google</span>
    </button>
  );
};
