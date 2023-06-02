import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  colors: {
    primary: 'rgb(54,161,139)',
    backgroundColor: '#fff',
    inputBackgroundColor: '#fff',
    danger: '#d01c1f',
    fontColor: '#0B0B0B',
    secondaryFontColor: '#401E03',
    shadowColor: 'rgb(0, 0, 0, 0.3)',
    listBackgroundColor: '#E9E9E9',
    createdRooms: '#000000',
  },
};

export const lightTheme: DefaultTheme = {
  colors: {
    primary: 'rgb(12, 22, 79)',
    backgroundColor: '#fff',
    inputBackgroundColor: '#efedfc',
    danger: '#d01c1f',
    fontColor: '#363537',
    secondaryFontColor: '#363537',
    shadowColor: 'rgb(0, 0, 0, 0.3)',
    listBackgroundColor: '#E9E9E9',
    createdRooms: '#000000',
  },
};

export const darkTheme: DefaultTheme = {
  colors: {
    primary: '#BB86FC',
    backgroundColor: '#363537',
    inputBackgroundColor: '#5c5c5c',
    danger: '#630f10',
    fontColor: '#FAFAFA',
    secondaryFontColor: '#0e033d',
    shadowColor: 'rgb(0, 0, 0, 0.3)',
    listBackgroundColor: '#999',
    createdRooms: '#000000',
  },
};
