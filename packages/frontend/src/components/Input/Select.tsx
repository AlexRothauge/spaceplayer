import styled from 'styled-components';

export const Select = styled.select`
  display: block;
  font-size: 14px;
  font-family: 'Bradly Hand', cursive;
  font-weight: 700;
  color: ${(props) => props.theme.colors.fontColor};
  line-height: 1.3;
  padding: 0.6em 1.4em 0.5em 0.8em;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: 1px solid #aaa;
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
  border-radius: 0.5em;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: ${(props) => props.theme.colors.backgroundColor};
  background-repeat: no-repeat, repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 0.65em auto, 100%;
  margin-bottom: 15px;

  &:hover {
    border-color: #888;
  }

  &:focus {
    border: 1px solid ${(props) => props.theme.colors.primary};
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 2px ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px -moz-mac-focusring;
    color: ${(props) => props.theme.colors.fontColor};
    outline: none;
  }
`;
