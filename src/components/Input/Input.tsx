import { Input as AntInput } from 'antd';
import { ChangeEventHandler, FC } from 'react';
import './Input.scss';

interface InputProps {
  errorMessage?: string;
  isPassword?: boolean;
  value?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onValidate?: (value: string) => void;
}

export const Input: FC<InputProps> = ({ isPassword, errorMessage, onValidate, ...props }) => {
  const CustomInput = isPassword ? AntInput.Password : AntInput;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    props.onChange?.(e);
    if (onValidate) {
      onValidate(e.target.value);
    }
  };

  return (
    <div className="input">
      <CustomInput
        {...props}
        onChange={handleChange}
        {...(errorMessage ? { status: 'error' } : {})}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};
