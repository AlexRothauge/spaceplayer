import React, { useContext, useEffect, useState } from 'react';
import { Redirect, Route, RouteProps, Switch, BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { authContext, AuthProvider } from './contexts/AuthenticationContext';
import { LoginPage } from './pages/Login/LoginPage';
import { GamePage } from './pages/GamePage';
import { RegisterPage } from './pages/Register/RegisterPage';
import { lightTheme, darkTheme } from './theme';
import { GuestPage } from './pages/GuestPage/GuestPage';
import { HomePage } from './pages/HomePage/HomePage';
import { ThemeButton } from './components/ThemeButton';

export const BasePage = () => {
  const { token, checkGuest } = useContext(authContext);
  console.log('Base=>', checkGuest);
  if (token || checkGuest) {
    return <Redirect to="/home" />;
  }
  return <Redirect to="/guestmode" />;
};

const UnauthenticatedRoute: React.FC<RouteProps> = ({ children, ...routeProps }) => {
  const { token, checkGuest } = useContext(authContext);
  if (token === null && !checkGuest) {
    return <Route {...routeProps} />;
  }
  return <Redirect to="/" />;
};

const AuthenticatedRoute: React.FC<RouteProps> = ({ children, ...routeProps }) => {
  // Check if its the game Route and disable Theme Button
  const props = { ...routeProps };
  if (props.path === '/game') {
    window.localStorage.setItem('enableTheme', 'false');
  } else {
    window.localStorage.setItem('enableTheme', 'true');
  }

  const {
    token,
    checkGuest,
    actions: { getTokenData, logout },
  } = useContext(authContext);
  if (token !== null) {
    const tokenData = getTokenData();
    if (tokenData !== null) {
      const { exp } = tokenData;
      if (parseInt(exp, 10) * 1000 > Date.now()) {
        return <Route {...routeProps} />;
      }
      logout();
    }
  } else if (checkGuest) {
    console.log('Aun=>', checkGuest);
    return <Route {...routeProps} />;
  }
  return <Redirect to="/" />;
};

export const App = () => {
  // Theme toggler
  const [theme, setTheme] = useState('light');
  const [enableThemeState, setEnableThemeState] = useState('true');

  const themeToggler = () => {
    if (theme === 'light') {
      setTheme('dark');
      window.localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      window.localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const enableTheme = window.localStorage.getItem('enableTheme');
    if (enableTheme) {
      setEnableThemeState(enableTheme);
    }
    if (enableTheme === 'true') {
      const localTheme = window.localStorage.getItem('theme');

      if (localTheme) {
        setTheme(localTheme);
      }
    }
  }, []);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <AuthProvider>
        <BrowserRouter>
          <ThemeButton theme={theme} enableThemeState={enableThemeState} themeToggler={themeToggler} />
          <Switch>
            <UnauthenticatedRoute path="/mygame" exact={true} component={GamePage} />
            <UnauthenticatedRoute path="/login" exact={true} component={LoginPage} />
            <UnauthenticatedRoute path="/register" exact={true} component={RegisterPage} />
            <UnauthenticatedRoute path="/guestmode" exact={true} component={GuestPage} />
            <AuthenticatedRoute path="/game" exact={true} component={GamePage} />
            <AuthenticatedRoute path="/home" exact={true} component={HomePage} />
            <Route path="/" component={BasePage} />
          </Switch>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};
