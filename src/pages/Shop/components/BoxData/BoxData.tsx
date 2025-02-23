interface Props {
  title: string
  number: number
  color: string
}

export default function BoxData({ title, number, color }: Props) {
  return (
    <div>
      <div className={`border-t-4 w-80 h-32 ${color} bg-white rounded-lg`}>
        <h2 className='text-left text-xl font-bold tracking-tight text-slate-500 sm:py-4 p-4'>{title}</h2>
        <h1 className='text-right font-bold text-2xl p-4'>{number}</h1>
      </div>
    </div>
  )
}
