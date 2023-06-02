import React, { ChangeEvent, useContext, useState } from 'react';
import { accessAsGuestOptions, authContext } from '../../contexts/AuthenticationContext';
import styled from 'styled-components';
import { Logo } from '../../components/Logo';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button';
import { UnauthenticatedLayout } from '../../components/UnauthenticationLayout';

import { StyledLink } from '../../components/StyledLink';

const LoginMask = styled.div`
  border-radius: 8px;
  padding: 20px 16px;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.075);
  background-color: ${(props) => props.theme.colors.inputBackgroundColor};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  min-height: 384px;
  width: 375px;
  line-height: 25.2px;
`;
const LoginMaskHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: inherit;
`;

const LogoHolder = styled.div`
  color: ${(props) => props.theme.colors.fontColor};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 25px;
`;

export const GuestPage = () => {
  const auth = useContext(authContext);
  const [values, setValues] = useState<accessAsGuestOptions>({
    guestName: '',
  });
  window.document.title = 'Guest Mode';
  const fieldDidChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    auth.actions.loginAsGuest(values);
  };

  return (
    <UnauthenticatedLayout>
      <LoginMaskHolder>
        <form onSubmit={onSubmitForm}>
          <LoginMask>
            <LogoHolder>
              <Logo />
            </LogoHolder>
            <Input name="guestName" type="text" label="User Name" onChange={fieldDidChange} required={true} />
            <Button type="submit">Go to play</Button>
            <StyledLink to="/register">Register here</StyledLink>
            <StyledLink to="/login">Login here</StyledLink>
          </LoginMask>
        </form>
      </LoginMaskHolder>
    </UnauthenticatedLayout>
  );
};
