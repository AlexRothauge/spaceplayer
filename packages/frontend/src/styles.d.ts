import {} from 'styled-components/cssprop';
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      backgroundColor: string;
      inputBackgroundColor: string;
      fontColor: string;
      secondaryFontColor: string;
      shadowColor: string;
      listBackgroundColor: string;
      primary: string;
      danger: string;
      createdRooms: string;
    };
  }
}
