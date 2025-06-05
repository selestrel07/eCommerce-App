import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';
import { ChangeEvent } from 'react';

describe('Input Component', () => {
  const mockOnChange = vi.fn<(e: ChangeEvent<HTMLInputElement>) => void>();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should display the value passed via props.value', () => {
    render(<Input value="test" />);
    const inputElement = screen.getByDisplayValue('test');
    expect(inputElement).toBeInTheDocument();
  });

  it('should render fieldName as a label', () => {
    render(<Input fieldName="Name" />);
    expect(screen.getByText(/name/i)).toBeInTheDocument();
  });

  it('should not render fieldName if it is not provided', () => {
    render(<Input />);
    expect(screen.queryByText(/name/i)).not.toBeInTheDocument();
  });

  it('should call onChange when typing into the input', async () => {
    render(<Input value="" onChange={mockOnChange} placeholder="Enter text" />);

    const inputElement = screen.getByPlaceholderText(/enter text/i);

    await userEvent.type(inputElement, 'new text');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should display error message when errorMessage is provided', () => {
    render(<Input errorMessage="Error occurred" />);
    expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
  });

  it('should apply "error" status to AntD Input', () => {
    const { container } = render(<Input errorMessage="Error" />);
    const inputContainer =
      container.querySelector('.ant-input-affix-wrapper') ?? container.querySelector('.ant-input');

    expect(inputContainer).toBeInTheDocument();
    expect(inputContainer).toHaveClass('ant-input-status-error');
  });

  it('should use Input.Password if isPassword is true', () => {
    const { container } = render(<Input isPassword />);
    const passwordInput = container.querySelector('input[type="password"]');
    expect(passwordInput).toBeInTheDocument();
  });

  it('should not use Input.Password if isPassword is false or not provided', () => {
    const { container } = render(<Input />);
    const passwordInput = container.querySelector('input[type="password"]');
    expect(passwordInput).not.toBeInTheDocument();
  });
});
