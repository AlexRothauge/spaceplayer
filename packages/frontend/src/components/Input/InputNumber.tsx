import React from 'react';
import styled from 'styled-components';

const InputLabel = styled.label`
  position: absolute;
  left: 50px;
  top: 23px;
  color: ${(props) => props.theme.colors.fontColor};
  transform: matrix(1, 0, 0, 1, 0, -12.5);
  transition-property: transform;
  line-height: 25px;
  font-size: 16px;
  font-family: 'Bradly Hand', cursive;
  transition-duration: 0.3s;
`;

const InputField = styled.input`
  background-color: transparent;
  padding: 16px 21px 13px;
  outline-width: 0;
  border-width: 0;
  font-family: 'Bradly Hand', cursive;
  height: 100%;
  width: 68%;
  color: ${(props) => props.theme.colors.fontColor};
`;

const InputContainer = styled.div`
  transition-duration: 0.4s;
  transition-property: box-shadow, border-color;
  border: 1px solid rgb(230, 230, 230);
  left: 50%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.backgroundColor};
  color: ${(props) => props.theme.colors.fontColor};
  position: relative;
  height: 45px;
  width: 85px;
  margin-bottom: 16px;

  &:focus-within {
    border: 1px solid ${(props) => props.theme.colors.primary};
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 2px ${(props) => props.theme.colors.primary};
  }
`;

const InputHolder = styled.div`
  position: relative;
`;

export const InputNumber = ({
  id,
  label,
  min,
  ...props
}: React.ComponentPropsWithoutRef<'input'> & {
  id: string;
  label: string;
  min: string;
  type?: 'number';
}) => {
  return (
    <InputHolder>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <InputContainer>
        <InputField {...props} id={id} min={min} placeholder=" " />
      </InputContainer>
    </InputHolder>
  );
};
