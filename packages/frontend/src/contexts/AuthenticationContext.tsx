import React, { useState } from 'react';

export type LoginOptions = {
  userName: string;
  password: string;
};

export type LoginResponse = {
  status: 'ok';
  data: string;
};

export type RegisterOptions = {
  userName: string;
  password: string;
};

export type accessAsGuestOptions = {
  guestName: string;
};

export type JWTTokenData = {
  id: number;
  userName: string;
  iat: string;
  exp: string;
};

export type AuthContext = {
  token: string | null;
  checkGuest: boolean;
  actions: {
    login: (options: LoginOptions) => Promise<void>;
    register: (options: RegisterOptions) => Promise<void>;
    getTokenData: () => JWTTokenData | null;
    loginAsGuest: (options: accessAsGuestOptions) => void;
    logout: () => void;
  };
};

export const initialAuthContext = {
  actions: {
    getTokenData: () => null,
    login: async () => undefined,
    logout: () => undefined,
    register: async () => undefined,
    loginAsGuest: () => undefined,
  },
  token: null,
  checkGuest: false,
};

export const authContext = React.createContext<AuthContext>(initialAuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(window.localStorage.getItem('auth-token'));
  const [checkGuest, setCheckGuest] = useState<boolean>(window.localStorage.getItem('GuestCheck') ? true : false);

  const login = async (values: LoginOptions) => {
    const loginRequest = await fetch('/api/user/token', {
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (loginRequest.status === 200) {
      const { data } = await loginRequest.json();
      setToken(data);
      window.localStorage.setItem('auth-token', data);
      window.localStorage.setItem('userName', values.userName);
    } else {
      throw new Error('user does not exist or the password is wrong! try again');
    }
  };

  const register = async (values: RegisterOptions) => {
    const registerRequest = await fetch('/api/user', {
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (registerRequest.status === 201) {
      await registerRequest.json();
      await login({ userName: values.userName, password: values.password });
    } else if (registerRequest.status === 400) {
      throw new Error('The name is already exist or the password ist invalid');
    }
  };
  const getTokenData = () => {
    if (token) {
      return JSON.parse(atob(token.split('.')[1]));
    }
    return null;
  };

  const loginAsGuest = (values: accessAsGuestOptions) => {
    window.localStorage.setItem('userName', values.guestName);
    window.localStorage.setItem('GuestCheck', 'true');
    setCheckGuest(true);
  };

  const logout = () => {
    setToken(null);
    setCheckGuest(false);
    console.log('Log out');
    window.localStorage.removeItem('auth-token');
    window.localStorage.removeItem('GuestCheck');
    window.localStorage.removeItem('userName');
  };
  return (
    <authContext.Provider
      value={{
        actions: {
          getTokenData,
          login,
          logout,
          register,
          loginAsGuest,
        },
        token,
        checkGuest,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
