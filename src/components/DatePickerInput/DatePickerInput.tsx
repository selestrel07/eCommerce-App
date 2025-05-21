import { DatePicker as AntDatePicker } from 'antd';
import { FC } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Alert from 'antd/es/alert/Alert';

interface DatePickerInputProps {
  value?: string | null;
  onChange?: (date: string | undefined) => void;
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
    onChange?.(selectedDate || undefined);
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
      {errorMessage && <Alert type="error" message={errorMessage} />}
    </div>
  );
};
