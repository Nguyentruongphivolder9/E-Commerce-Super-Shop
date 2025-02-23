interface Props {
  width?: string
  height?: string
  widthIcon?: string
  heightIcon?: string
}

export default function LoadingContainer({ width, height, widthIcon = 'w-20', heightIcon = 'h-20' }: Props) {
  return (
    <div className={`${width ? width : 'w-full'} ${height ? height : 'h-full'} flex items-center justify-center`}>
      <div
        className={`${widthIcon} ${heightIcon} border-8 border-dashed rounded-full animate-spin border-gray-300`}
      ></div>
    </div>
  )
}
