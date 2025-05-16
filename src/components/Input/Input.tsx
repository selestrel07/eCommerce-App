import { Input as AntInput } from 'antd';
import { ChangeEventHandler, FC } from 'react';
import './Input.scss';

interface InputProps {
  fieldName?: string;
  errorMessage?: string;
  isPassword?: boolean;
  value?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export const Input: FC<InputProps> = ({
  fieldName,
  isPassword,
  errorMessage,
  value,
  onChange,
  ...props
}) => {
  const CustomInput = isPassword ? AntInput.Password : AntInput;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange?.(e);
  };

  return (
    <div className="input">
      {fieldName ? <p>{fieldName}</p> : undefined}
      <CustomInput
        {...props}
        value={value}
        onChange={handleChange}
        status={errorMessage ? 'error' : undefined}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};
