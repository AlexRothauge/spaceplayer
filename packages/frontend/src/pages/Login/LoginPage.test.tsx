import React from 'react';
import { render, fireEvent } from '../../utils/tests';
import { authContext, initialAuthContext } from '../../contexts/AuthenticationContext';
import { LoginPage } from './LoginPage';
import { BrowserRouter } from 'react-router-dom';

describe('LoginPage', () => {
  it('is able to login', () => {
    const loginMock = jest.fn();
    const { getByLabelText, getByText } = render(
      <BrowserRouter>
        <authContext.Provider value={{ ...initialAuthContext, actions: { ...initialAuthContext.actions, login: loginMock } }}>
          <LoginPage />
        </authContext.Provider>
        ,
      </BrowserRouter>,
    );
    const name = getByLabelText(/name/i);
    const password = getByLabelText(/password/i);
    const submitButton = getByText(/log in/i);

    const testUser = {
      userName: 'test',
      password: '987654321',
    };

    fireEvent.change(name, { target: { value: testUser.userName } });
    fireEvent.change(password, { target: { value: testUser.password } });
    fireEvent.click(submitButton);

    expect(loginMock).toHaveBeenCalledTimes(1);
    expect(loginMock).toHaveBeenCalledWith(testUser);
  });
});
