import React from 'react';
import { lightTheme, darkTheme } from '../theme';
import { Button } from './Button';

export const ThemeButton: React.FC<{ theme: string; enableThemeState: string; themeToggler: () => void }> = ({
  theme,
  enableThemeState,
  themeToggler,
}) => {
  function getBackgroundColor() {
    return theme === 'light' ? lightTheme.colors.backgroundColor : darkTheme.colors.backgroundColor;
  }

  return (
    <div style={enableThemeState === 'true' ? { backgroundColor: `${getBackgroundColor()}` } : { backgroundColor: '#fff' }}>
      <Button disabled={enableThemeState === 'true' ? false : true} onClick={themeToggler} style={{ marginLeft: 25, marginTop: 15, width: '20%' }}>
        {getBackgroundColor() === lightTheme.colors.backgroundColor ? 'Dark Theme' : 'Light Theme'}
      </Button>
    </div>
  );
};
