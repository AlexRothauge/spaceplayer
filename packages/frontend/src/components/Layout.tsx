import React, { useContext } from 'react';
// tslint:disable-next-line: no-submodule-imports
import styled, { css } from 'styled-components/macro';
import { authContext } from '../contexts/AuthenticationContext';

const footerHeight = '50px';

export const MaxWidthCSS = css`
  max-width: 1020px;
  margin: auto;
`;
const TextButton = styled.button`
  all: unset;
  color: ${(props) => props.theme.colors.primary};
  pointer: click;
`;

const headerHeight = '80px';

const Main = styled.main`
  min-height: calc(100vh - ${footerHeight});
  padding: 0 25px;
  ${MaxWidthCSS}
`;

const Footer = styled.footer`
  height: ${footerHeight};
  padding: 0 25px;
  ${MaxWidthCSS};
`;
const Header = styled.header`
  height: ${headerHeight};
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 25px;
`;

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.colors.backgroundColor};
`;

export const Layout: React.FC = ({ children }) => {
  const {
    actions: { logout },
  } = useContext(authContext);
  const onLogout = () => {
    logout();
  };

  return (
    <Wrapper>
      <Header>
        <TextButton onClick={onLogout}>Logout</TextButton>
      </Header>

      <Main>{children}</Main>
      <Footer>© SPACE PLAYER</Footer>
    </Wrapper>
  );
};
