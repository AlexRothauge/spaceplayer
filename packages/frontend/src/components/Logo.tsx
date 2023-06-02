import React from 'react';
import styled from 'styled-components';
import ImageLogo from '../ressource/ImageLogo.png';
const LogoMask = styled.div`
  font-size: 25px;
  letter-spacing: 1px;
  font-family: 'Bradly Hand', cursive;
  flex: 1;
`;
const LogoTitle = styled.div`
  text-decoration: none;
`;
const LogoImage = styled.img`
  transform: rotate(45deg);
  width: 55px;
  height: 65px;
  margin-bottom: -1.5rem;
  margin-left: 18px;
`;

export const Logo = () => {
  return (
    <LogoMask>
      <LogoTitle>
        SPACE PLAYER
        <LogoImage src={ImageLogo} />
      </LogoTitle>
    </LogoMask>
  );
};
