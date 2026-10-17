/**
 * Validated Environment Configuration
 * 
 * Centralizes all environment variable lookups and validation.
 * Never access import.meta.env directly across UI components.
 */

interface EnvironmentConfig {
  isDev: boolean;
  isProd: boolean;
  demoMode: boolean;
  appUrl: string;
  defaultCredentials: {
    adminEmail: string;
    affiliateEmail: string;
    clientEmail: string;
  };
}

const getEnvBool = (value: string | undefined, defaultVal = false): boolean => {
  if (value === undefined || value === '') return defaultVal;
  return value.toLowerCase() === 'true' || value === '1';
};

const getEnvString = (value: string | undefined, defaultVal: string): string => {
  return value && value.trim().length > 0 ? value : defaultVal;
};

export const env: EnvironmentConfig = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  demoMode: !import.meta.env.PROD && getEnvBool(import.meta.env.VITE_DEMO_MODE, false),
  appUrl: getEnvString(import.meta.env.APP_URL, 'https://purvaphalguni.com'),
  defaultCredentials: {
    adminEmail: getEnvString(import.meta.env.VITE_DEFAULT_ADMIN_EMAIL, 'director@purvaphalguni.com'),
    affiliateEmail: getEnvString(import.meta.env.VITE_DEFAULT_AFFILIATE_EMAIL, 'practitioner@purvaphalguni.com'),
    clientEmail: getEnvString(import.meta.env.VITE_DEFAULT_CLIENT_EMAIL, 'client@purvaphalguni.com')
  }
};
