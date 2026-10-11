import { useState, useCallback } from 'react';
import { UserRole, UserProfile } from '../types/practice';
import { usePractice } from '../context/PracticeContext';
import { PracticeStore } from '../services/store';
import { AuthenticationError } from '../errors/AppError';
import { logError } from '../errors/errorHandler';
import { soundSynth } from '../utils/soundAmbience';

export function useAuth() {
  const { currentRole, currentUser, setRole, showToast } = usePractice();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string, role: UserRole): Promise<UserProfile> => {
      setIsAuthenticating(true);
      setAuthError(null);

      try {
        const result = await PracticeStore.authenticateUser(email, password, role);
        if (!result.success || !result.user) {
          throw new AuthenticationError(result.error || 'Authentication rejected.');
        }

        soundSynth.playCelestialChime();
        setRole(role);
        showToast({
          type: 'success',
          title: 'Authentication Granted',
          message: `Entered sanctuary as ${result.user.name}.`
        });

        return result.user;
      } catch (err: any) {
        logError(err, 'useAuth.login');
        const message = err.message || 'Incorrect credentials provided.';
        setAuthError(message);
        throw err;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [setRole, showToast]
  );

  const logout = useCallback(() => {
    soundSynth.playSoftTap();
    setRole('public');
    showToast({
      type: 'info',
      title: 'Session Concluded',
      message: 'Returned to public observatory view.'
    });
  }, [setRole, showToast]);

  return {
    currentRole,
    currentUser,
    isAuthenticated: currentRole !== 'public',
    isAuthenticating,
    authError,
    setAuthError,
    login,
    logout,
    switchRole: setRole
  };
}
