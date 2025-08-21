export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export const authenticateAdmin = async (password: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    
    const result = await response.json();
    
    if (result.success) {
      localStorage.setItem('adminAuthenticated', 'true');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Authentication failed:', error);
    return false;
  }
};

export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem('adminAuthenticated') === 'true';
};

export const logout = (): void => {
  localStorage.removeItem('adminAuthenticated');
};
