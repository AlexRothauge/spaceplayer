import React from 'react';
import { render, fireEvent } from '../../utils/tests';
import { Input } from './Input';

describe('Input', () => {
  it('does render', () => {
    // tslint:disable-next-line:no-unused-expression
    <Input label="Name" />;
  });

  it('Label and input are connected', async () => {
    const { findByLabelText } = render(<Input label="Name" />);

    const input = (await findByLabelText('Name')) as HTMLInputElement;
    expect(input.type).toBe('text');
    expect(input.tagName).toBe('INPUT');
  });

  it('can type into input', async () => {
    const { getByLabelText } = render(<Input label="Name" />);

    const input = getByLabelText(/name/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('test');
  });
});
