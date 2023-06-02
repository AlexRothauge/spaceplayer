import React from 'react';
import { render, fireEvent } from '../../utils/tests';
import { InputNumber } from './InputNumber';

describe('Input', () => {
  it('does render', () => {
    // tslint:disable-next-line:no-unused-expression
    <InputNumber id="InputNu" label="Name" min="1" />;
  });

  it('Label and input are connected', async () => {
    const { findByLabelText } = render(<InputNumber id="InputNu" label="Name" min="1" type="number" />);

    const inputNumber = (await findByLabelText('Name')) as HTMLInputElement;
    expect(inputNumber.type).toBe('number');
    expect(inputNumber.tagName).toBe('INPUT');
    expect(inputNumber.min).toBe('1');
  });

  it('can type into input', async () => {
    const { getByLabelText } = render(<InputNumber id="InputNu" label="Name" min="1" />);

    const input = getByLabelText(/name/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '2' } });
    expect(input.value).toBe('2');
  });
});
