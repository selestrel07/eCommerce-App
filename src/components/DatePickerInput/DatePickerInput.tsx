import { DatePicker as AntDatePicker } from 'antd';
import { FC } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Alert from 'antd/es/alert/Alert';
import { DatePickerInputProps } from '../../interfaces/component-props/component-props.ts';

export const DatePickerInput: FC<DatePickerInputProps> = ({
  fieldName,
  value,
  errorMessage,
  onChange,
  placeholder,
  disabled,
}) => {
  const handleDateChange = (_date: Dayjs | null, dateString: string | string[]) => {
    const selectedDate = Array.isArray(dateString) ? dateString[0] : dateString;
    onChange?.(selectedDate || undefined);
  };

  return (
    <div className="input">
      {fieldName ? <p>{fieldName}</p> : undefined}
      <AntDatePicker
        value={value ? dayjs(value) : null}
        status={errorMessage ? 'error' : undefined}
        style={{ width: '100%' }}
        onChange={handleDateChange}
        placeholder={placeholder}
        disabled={disabled}
      />
      {errorMessage && <Alert type="error" message={errorMessage} />}
    </div>
  );
};
