import React, { useRef } from 'react';
import styled from 'styled-components';

const InputLabel = styled.label`
  position: absolute;
  left: 15px;
  top: 35px;
  color: rgb(116, 116, 116);
  transform: matrix(1, 0, 0, 1, 0, -12.5);
  transition-property: transform;
  line-height: 25px;
  font-size: 18px;
  font-family: 'Bradly Hand', cursive;
  transition-duration: 0.3s;
`;

const InputField = styled.input`
  background-color: transparent;
  padding: 35px 21px 13px;
  outline-width: 0;
  border-width: 0;
  font-family: 'Bradly Hand', cursive;
  &:focus + ${InputLabel} {
    transform: matrix(0.8, 0, 0, 0.8, 0, -24.75);
  }
  &:not(:placeholder-shown) + ${InputLabel} {
    transform: matrix(0.8, 0, 0, 0.8, 0, -24.75);
  }
  height: 100%;
  width: 88.5%;
`;

const InputContainer = styled.div`
  transition-duration: 0.4s;
  transition-property: box-shadow, border-color;
  border: 1px solid rgb(230, 230, 230);

  border-radius: 5px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  color: #000;
  position: relative;
  height: 72px;
  margin-bottom: 16px;

  &:focus-within {
    border: 1px solid ${(props) => props.theme.colors.primary};
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 2px ${(props) => props.theme.colors.primary};
  }
`;

export const Input = ({
  label,
  ...props
}: React.ComponentPropsWithoutRef<'input'> & {
  label: string;
  type?: 'text' | 'password' | 'number';
}) => {
  const id = useRef(`${label.replace(' ', '-')}-${Math.floor(Math.random() * 10000)}`);

  return (
    <InputContainer>
      <InputField {...props} id={id.current} placeholder=" " />
      <InputLabel htmlFor={id.current}>{label}</InputLabel>
    </InputContainer>
  );
};
