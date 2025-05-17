import { DatePicker as AntDatePicker } from 'antd';
import { FC } from 'react';
import dayjs, { Dayjs } from 'dayjs';

interface DatePickerInputProps {
  value?: string | null;
  onChange?: (date: string | null) => void;
  errorMessage?: string;
  placeholder?: string;
}

export const DatePickerInput: FC<DatePickerInputProps> = ({
  value,
  errorMessage,
  onChange,
  placeholder,
}) => {
  const handleDateChange = (_date: Dayjs | null, dateString: string | string[]) => {
    const selectedDate = Array.isArray(dateString) ? dateString[0] : dateString;
    onChange?.(selectedDate || null);
  };

  return (
    <div className="input">
      <AntDatePicker
        value={value ? dayjs(value) : null}
        status={errorMessage ? 'error' : undefined}
        style={{ width: '100%' }}
        onChange={handleDateChange}
        placeholder={placeholder}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};
