import React from 'react';
import { render, fireEvent } from '../../utils/tests';
import { authContext, initialAuthContext } from '../../contexts/AuthenticationContext';
import { BrowserRouter } from 'react-router-dom';
import { RegisterPage } from './RegisterPage';

describe('RegisterPage', () => {
  it('is able to register', () => {
    const registerMock = jest.fn();
    const { getByLabelText, getByText } = render(
      <BrowserRouter>
        <authContext.Provider value={{ ...initialAuthContext, actions: { ...initialAuthContext.actions, register: registerMock } }}>
          <RegisterPage />
        </authContext.Provider>
        ,
      </BrowserRouter>,
    );
    const name = getByLabelText(/user name/i);
    const password = getByLabelText(/password/i);
    const submitButton = getByText(/register/i);

    const testUser = {
      userName: 'test',
      password: '987654321',
    };

    fireEvent.change(name, { target: { value: testUser.userName } });
    fireEvent.change(password, { target: { value: testUser.password } });
    fireEvent.click(submitButton);

    expect(registerMock).toHaveBeenCalledTimes(1);
    expect(registerMock).toHaveBeenCalledWith(testUser);
  });
});
