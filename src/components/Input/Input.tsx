import {
  InputHTMLAttributes,
  useState,
  useEffect,
  ChangeEvent
} from 'react';
import { RegisterOptions, UseFormRegister } from 'react-hook-form';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  defaultValueForDateInput?: Date | null
  errorMessage?: string;
  classNameInput?: string;
  classNameError?: string;
  classNameEye?: string;
  classNameInputError?: string;
  register?: UseFormRegister<any>;
  rules?: RegisterOptions;
  rightClearButton?: boolean;
  handleSetBirthDateValue?: React.Dispatch<React.SetStateAction<Date | null>>;
  valueHolder?: any
}

const Input = ({
  defaultValueForDateInput,
  handleSetBirthDateValue,
  valueHolder,
  rightClearButton,
  errorMessage,
  className,
  name,
  register,
  rules,
  classNameInputError = '',
  classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-blue-500 focus:shadow-md transition duration-300',
  classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm transition-opacity duration-300 ease-in-out',
  classNameEye = 'absolute size-5 top-[8px] right-[5px] cursor-pointer',
  value,
  onChange,
  ...rest
}: Props) => {
  const [openEye, setOpenEye] = useState(false);
  const [dateError, setDateError] = useState('');
  const [defaultDateInput, setDafaultDateInput] = useState<Date | null>(defaultValueForDateInput ? defaultValueForDateInput : null);
  const [day, setDay] = useState(defaultDateInput ? defaultDateInput.getDay().toString() : "");
  const [month, setMonth] = useState(defaultDateInput ? defaultDateInput.getMonth().toString() : "");
  const [year, setYear] = useState(defaultDateInput ? defaultDateInput.getFullYear().toString() : "");
  const toggleEye = () => setOpenEye(prev => !prev);
  const handleType = () => (rest.type === 'password' ? (openEye ? 'text' : 'password') : rest.type);


  const handleCutUpPhoneNumber = (phoneNum?: string): string => {
    if (typeof phoneNum === "string") {
      if (phoneNum.length <= 4) {
        return phoneNum;
      }
      const last4Digits = phoneNum.slice(-4);
      const maskedDigits = '*'.repeat(phoneNum.length - 4);
      return maskedDigits + last4Digits;
    } else {
      return "";
    }
  };
  useEffect(() => {
    if (day && month && year) {
      const parsedYear = parseInt(year);
      const parsedMonth = parseInt(month);
      const parsedDay = parseInt(day);
      const date = new Date(parsedYear, parsedMonth, parsedDay);

      if (date.getFullYear() !== parsedYear || date.getMonth() !== parsedMonth || date.getDate() !== parsedDay) {
        setDateError('Ngày không hợp lệ');
      } else {
        setDateError('');
        const dateObject = new Date(parsedYear, parsedMonth, parsedDay);
        handleSetBirthDateValue?.(dateObject);
      }
    } else {
      setDateError('Ngày sinh chưa được nhập')
    }
  }, [day, month, year, handleSetBirthDateValue]);

  const handleClear = () => {
    setDay('');
    setMonth('');
    setYear('');
    // Gọi onChange của registerResult nếu có
  };

  const renderDateInput = () => (

    <>
      <div className="flex space-x-2">
        {['day', 'month', 'year'].map((unit) => {
          const values = unit === 'day'
            ? Array.from({ length: 31 }, (_, i) => i + 1)
            : unit === 'month'
              ? Array.from({ length: 12 }, (_, i) => i + 1)
              : Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => new Date().getFullYear() - i);

          return (
            <>
              <select
                key={unit}
                className={`${classNameInput} ${!eval(unit) ? 'text-gray-400' : ''}`}
                value={eval(unit)}
                onChange={(e) => eval(`set${unit.charAt(0).toUpperCase() + unit.slice(1)}`)(e.target.value)}
                name={`${name}-${unit}`}

              >
                <option value="">{unit.charAt(0).toUpperCase() + unit.slice(1)}</option>
                {values.map(value => (
                  <option key={value} value={value}>
                    {unit.charAt(0).toUpperCase() + unit.slice(1)} {value}
                  </option>
                ))}
              </select>
            </>
          );
        })}
      </div>
    </>
  );

  const renderInput = () => {
    if (rest.type === 'date') return renderDateInput();

    if (rest.type === 'genderSelect') {
      // Extract registerResult to avoid direct spread
      const registerResult = register ? register(name ? name : "", rules) : {};
      const defaultValue = value || "male";
      return (
        <select
          className={classNameInput}
          value={value || defaultValue}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            //@ts-ignore
            if (onChange) onChange(e);
            //@ts-ignore
            registerResult?.onChange({
              ...e,
              target: { ...e.target, value: e.target.value }
            } as unknown as ChangeEvent<HTMLInputElement>);
          }}
          {...registerResult}
        >
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
        </select>
      );
    }


    if (rest.type === "profile_phone_number" && typeof value === "string") {
      return (
        <input
          className={`${classNameInput} ${errorMessage ? classNameInputError : ''}`}
          {...register && name ? register(name, rules) : {}}
          {...rest}
          type={handleType()}
          value={handleCutUpPhoneNumber(value)}
        />
      );
    }
    return (
      <input
        className={`${classNameInput} ${errorMessage ? classNameInputError : ''}`}
        {...register && name ? register(name, rules) : {}}
        {...rest}
        type={handleType()}
        value={valueHolder}
      />
    );
  };

  return (
    <div className={`relative ${className}`}>
      {rightClearButton && rest.type !== 'date' && rest.type !== 'genderSelect' && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 hover:bg-slate-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      {renderInput()}
      {rest.type === 'password' && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className={classNameEye}
          onClick={toggleEye}
        >
          {openEye ? (
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
            />
          ) : (
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.372 3.372'
            />
          )}
        </svg>
      )}
      {errorMessage && <div className={classNameError}>{errorMessage}</div>}
    </div>
  );
};

export default Input;
