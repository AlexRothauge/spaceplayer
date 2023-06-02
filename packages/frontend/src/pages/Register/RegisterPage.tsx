import React, { ChangeEvent, useContext, useState } from 'react';
import { authContext, RegisterOptions } from '../../contexts/AuthenticationContext';
import styled from 'styled-components';
import { Logo } from '../../components/Logo';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button';
import { UnauthenticatedLayout } from '../../components/UnauthenticationLayout';

import { StyledLink } from '../../components/StyledLink';

const RegisterMask = styled.div`
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
const RegisterMaskHolder = styled.div`
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

export const RegisterPage = () => {
  const auth = useContext(authContext);
  const [values, setValues] = useState<RegisterOptions>({
    userName: '',
    password: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const fieldDidChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  window.document.title = 'Register Page';
  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    try {
      await auth.actions.register(values);
    } catch (e) {
      setFormError(e.message);
    }
  };

  return (
    <UnauthenticatedLayout>
      <RegisterMaskHolder>
        <form onSubmit={onSubmitForm}>
          <RegisterMask>
            <LogoHolder>
              <Logo />
            </LogoHolder>
            <p style={{ color: '#FF0000', textAlign: 'center' }}>{formError}</p>
            <Input name="userName" type="text" label="User Name" onChange={fieldDidChange} required={true} />
            <Input name="password" label="Password" type="password" onChange={fieldDidChange} required={true} />
            <Button type="submit">Register</Button>
            <StyledLink to="/login">Back to Login</StyledLink>
            <StyledLink to="/guestmode">Guest Mode</StyledLink>
          </RegisterMask>
        </form>
      </RegisterMaskHolder>
    </UnauthenticatedLayout>
  );
};
