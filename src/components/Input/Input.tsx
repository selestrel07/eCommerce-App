import { Input as AntInput } from 'antd';
import { ChangeEventHandler, FC } from 'react';
import './Input.scss';

interface InputProps {
  errorMessage?: string;
  isPassword?: boolean;
  value?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export const Input: FC<InputProps> = ({ isPassword, errorMessage, ...props }) => {
  const CustomInput = isPassword ? AntInput.Password : AntInput;

  return (
    <div className="input">
      <CustomInput {...props} {...(errorMessage ? { status: 'error' } : {})} />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};
