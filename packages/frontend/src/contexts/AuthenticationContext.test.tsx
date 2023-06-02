// tslint:disable-next-line:no-var-requires
require('jest-fetch-mock').enableMocks();

import React from 'react';
import { FetchMock } from 'jest-fetch-mock';
import { LoginResponse, LoginOptions, AuthProvider, authContext } from './AuthenticationContext';
import { render, act, fireEvent } from '@testing-library/react';

describe('AuthenticationContext', () => {
  beforeEach(() => {
    const fetchMock = fetch as FetchMock;
    fetchMock.resetMocks();
  });
  it('should be able to set a request on login', async () => {
    const loginResponse: LoginResponse = {
      data: 'random Token',
      status: 'ok',
    };
    const loginRequest: LoginOptions = {
      userName: 'test',
      password: 'password',
    };
    (fetch as FetchMock).mockResponseOnce(JSON.stringify(loginResponse));

    const { getByText } = render(
      <AuthProvider>
        <authContext.Consumer>
          {({ actions: { login } }) => {
            const loginFn = () => login(loginRequest);
            return <button onClick={loginFn}>login</button>;
          }}
        </authContext.Consumer>
      </AuthProvider>,
    );
    const submit = getByText(/login/i);
    await act(async () => {
      fireEvent.click(submit);
    });
    expect((fetch as FetchMock).mock.calls.length).toBe(1);
    expect((fetch as FetchMock).mock.calls[0][0]).toBe('/api/user/token');
    expect(((fetch as FetchMock).mock.calls[0][1] as RequestInit).method).toBe('POST');
    expect(((fetch as FetchMock).mock.calls[0][1] as RequestInit).body).toBe(JSON.stringify(loginRequest));
    expect(((fetch as FetchMock).mock.calls[0][1] as RequestInit).body).toBe(JSON.stringify(loginRequest));
  });
});
