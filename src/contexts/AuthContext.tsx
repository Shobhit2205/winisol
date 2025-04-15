'use client';

import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);

  // Function to update token and store in sessionStorage with expiry
  const setToken = (newToken: string | null) => {
    if (newToken) {
      const expiryTime = Date.now() + 60 * 60 * 1000; // 1 hour from now
      const tokenData = JSON.stringify({ token: newToken, expiryTime });

      sessionStorage.setItem("authorityToken", tokenData);
      setTokenState(newToken);
    } else {
      sessionStorage.removeItem("authorityToken");
      setTokenState(null);
    }
  };

  // Load token from sessionStorage and check expiry
  useEffect(() => {
    const tokenData = sessionStorage.getItem("authorityToken");
    
    if (tokenData) {
      const { token, expiryTime } = JSON.parse(tokenData);

      if (Date.now() > expiryTime) {
        console.log("Token expired!");
        setToken(null);
      } else {
        setTokenState(token);

        // Set timeout to auto-remove the token at the correct time
        const remainingTime = expiryTime - Date.now();
        const timeout = setTimeout(() => {
          console.log("Token expired!");
          setToken(null);
        }, remainingTime);

        return () => clearTimeout(timeout); // Cleanup timeout on unmount
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
