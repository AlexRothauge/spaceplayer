import React from 'react';
import { render, fireEvent } from '../../utils/tests';
import { authContext, initialAuthContext } from '../../contexts/AuthenticationContext';
import { BrowserRouter } from 'react-router-dom';
import { GuestPage } from './GuestPage';

describe('GuestPage', () => {
  it('is able to login as Guest', () => {
    const loginMock = jest.fn();
    const { getByLabelText, getByText } = render(
      <BrowserRouter>
        <authContext.Provider value={{ ...initialAuthContext, actions: { ...initialAuthContext.actions, loginAsGuest: loginMock } }}>
          <GuestPage />
        </authContext.Provider>
        ,
      </BrowserRouter>,
    );
    const name = getByLabelText(/user name/i);
    const submitButton = getByText(/go to play/i);

    const testUser = {
      guestName: 'test',
    };

    fireEvent.change(name, { target: { value: testUser.guestName } });
    fireEvent.click(submitButton);

    expect(loginMock).toHaveBeenCalledTimes(1);
    expect(loginMock).toHaveBeenCalledWith(testUser);
  });
});
