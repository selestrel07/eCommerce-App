import { Input as AntInput } from 'antd';
import { ChangeEventHandler, FC } from 'react';
import './Input.scss';

interface InputProps {
  errorMessage?: string;
  isPassword?: boolean;
  value?: string;
  placeholder?: string;
  isValidationError?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export const Input: FC<InputProps> = ({
  isPassword,
  isValidationError,
  errorMessage,
  ...props
}) => {
  const CustomInput = isPassword ? AntInput.Password : AntInput;

  return (
    <div className="input">
      <CustomInput {...props} {...(isValidationError ? { status: 'error' } : {})} />
      {isValidationError && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};
