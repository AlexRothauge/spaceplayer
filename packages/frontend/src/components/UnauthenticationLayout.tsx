import React from 'react';
// tslint:disable-next-line: no-submodule-imports
import styled, { css } from 'styled-components/macro';

const footerHeight = '50px';

export const MaxWidthCSS = css`
  max-width: 860px;
  margin: auto;
`;

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

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.colors.backgroundColor};
`;

export const UnauthenticatedLayout: React.FC = ({ children }) => {
  return (
    <Wrapper>
      <Main>{children}</Main>
      <Footer>© SPACE PLAYER</Footer>
    </Wrapper>
  );
};
