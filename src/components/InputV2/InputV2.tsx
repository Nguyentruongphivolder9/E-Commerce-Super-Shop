// import { InputHTMLAttributes, forwardRef, useState } from 'react'
// import { FieldPath, FieldValues, UseControllerProps, useController } from 'react-hook-form'

// export type InputNumberProps<
//   TFieldValues extends FieldValues = FieldValues,
//   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
// > = {
//   classNameInput?: string
//   classNameError?: string
// } & InputHTMLAttributes<HTMLInputElement> &
//   UseControllerProps<TFieldValues, TName>

// function InputV2<
//   TFieldValues extends FieldValues = FieldValues,
//   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
// >(props: InputNumberProps<TFieldValues, TName>) {
//   const {
//     type,
//     onChange,
//     className,
//     classNameInput = 'p-3 w-full rounded-sm outline-none border border-gray-300 focus:border-gray-500 focus:shadow-sm',
//     classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
//     value = '',
//     ...rest
//   } = props
//   const { field, fieldState } = useController(props)
//   const [localValue, setLocalValue] = useState<string>(field.value)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const valueFormInput = e.target.value
//     const numberCondition = type === 'number' && (/^\d+$/.test(valueFormInput) || valueFormInput === '')
//     if (numberCondition && type !== 'number') {
//       // cập nhật local value state
//       setLocalValue(valueFormInput)
//       //Gọi field.onChange để cập nhật vào state React hook form
//       field.onChange(e)
//       // Thực thi onChange callback từ bên ngoài truyền vào props
//       onChange && onChange(e)
//     }
//   }
//   return (
//     <div className={className}>
//       <input
//         className={classNameInput}
//         {...rest}
//         {...field}
//         onChange={(e) => handleChange(e)}
//         value={value || localValue}
//       />
//       <div className={classNameError}>{fieldState.error?.message}</div>
//     </div>
//   )
// }

// export default InputV2

// type Gen<TFunc> = {
//   getName: TFunc
// }

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// function Hexa<TFunc extends () => string, TLastName extends ReturnType<TFunc>>(props: {
//   person: Gen<TFunc>
//   lastName: TLastName
// }) {
//   return null
// }

// const handleName: () => 'Hien' = () => 'Hien'

// function App() {
//   return <Hexa person={{ getName: handleName }} lastName='Hien' />
// }
