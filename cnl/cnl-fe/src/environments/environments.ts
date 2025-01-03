type AppEnv =
  | 'local'
  | 'development'
  | 'qa'
  | 'production';

  declare global {
    interface Window {
      /** window.env will be injected through `env.js` at runtime */
      env: typeof processEnv;
    }
  }

  export type Environment = typeof environment;

/**
 *  the keys in `processEnv` are in sync with the keys in `env.js` and `entrypoint.sh`
 */
const processEnv = {
    REACT_APP_ENV: process.env.REACT_APP_ENV as AppEnv,
    REACT_APP_BACKEND_CNL_URL: process.env.REACT_APP_BACKEND_CNL_URL,
    // APP_VERSION: process.env.REACT_APP_VERSION,
  } as const;

  const getEnvVars = () => {
    function determineEnv() {
      const isTestEnv = process.env.NODE_ENV === 'test'; // for jest tests
      const isLocalEnv = processEnv.REACT_APP_ENV === 'local';
     
      /** Local and legacy CI builds loads env vars from `process.env`  */
      if (isTestEnv || isLocalEnv) {
        return processEnv;
      }
      return window.env;
    }
  
    const env = determineEnv();
  
    return {
      app: {
        appEnv: env.REACT_APP_ENV,
        port: 3000,
        backendUrl: env.REACT_APP_BACKEND_CNL_URL ?? 'http://localhost:4000',
        // ？app version
      },
      
    };
  };

  export const environment = getEnvVars();