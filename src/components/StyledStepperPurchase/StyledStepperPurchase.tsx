import { cloneElement, useState } from 'react'
import { Stepper, StepperProps, rem } from '@mantine/core'
import { OrderStatus } from 'src/types/order.type'

function StyledForStepper(props: StepperProps) {
  return (
    <Stepper
      styles={{
        stepBody: {
          display: 'none'
        },

        step: {
          padding: 0
        },

        stepIcon: {
          borderWidth: rem(4)
        },

        separator: {
          marginLeft: rem(-2),
          marginRight: rem(-2),
          height: rem(4)
        }
      }}
      {...props}
    />
  )
}

const getStepFromStatus = (status: string, isRating: boolean): number => {
  let calculateStep = 0
  switch (status) {
    case 'pending':
      calculateStep = 0
      break
    case 'confirmed':
      calculateStep = 1
      break
    case 'delivering':
      calculateStep = 2
      break
    case 'completed':
      calculateStep = !isRating ? 3 : 4
      break
    default:
      return 0
  }
  return calculateStep === 4 ? 4 + 1 : calculateStep
}

const arrayIconStatusPurchase = [
  {
    svg: (
      <svg className='w-8 h-8' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>
        <path d='M168,128a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,128Zm-8,24H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16ZM216,40V200a32,32,0,0,1-32,32H72a32,32,0,0,1-32-32V40a8,8,0,0,1,8-8H72V24a8,8,0,0,1,16,0v8h32V24a8,8,0,0,1,16,0v8h32V24a8,8,0,0,1,16,0v8h24A8,8,0,0,1,216,40Zm-16,8H184v8a8,8,0,0,1-16,0V48H136v8a8,8,0,0,1-16,0V48H88v8a8,8,0,0,1-16,0V48H56V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16Z'></path>
      </svg>
    )
  },
  {
    svg: (
      <svg className='w-8 h-8' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>
        <path d='M128,88a40,40,0,1,0,40,40A40,40,0,0,0,128,88Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,152ZM240,56H16a8,8,0,0,0-8,8V192a8,8,0,0,0,8,8H240a8,8,0,0,0,8-8V64A8,8,0,0,0,240,56ZM193.65,184H62.35A56.78,56.78,0,0,0,24,145.65v-35.3A56.78,56.78,0,0,0,62.35,72h131.3A56.78,56.78,0,0,0,232,110.35v35.3A56.78,56.78,0,0,0,193.65,184ZM232,93.37A40.81,40.81,0,0,1,210.63,72H232ZM45.37,72A40.81,40.81,0,0,1,24,93.37V72ZM24,162.63A40.81,40.81,0,0,1,45.37,184H24ZM210.63,184A40.81,40.81,0,0,1,232,162.63V184Z'></path>
      </svg>
    )
  },
  {
    svg: (
      <svg className='w-8 h-8' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>
        <path d='M255.42,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,255.42,117ZM192,88h34.58l9.6,24H192ZM32,72H176v64H32ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208Zm81-24H111a32,32,0,0,0-62,0H32V152H176v12.31A32.11,32.11,0,0,0,161,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm48-24H223a32.06,32.06,0,0,0-31-24V128h48Z'></path>
      </svg>
    )
  },
  {
    svg: (
      <svg className='w-8 h-8' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>
        <path d='M232,198.65V240a8,8,0,0,1-16,0V198.65A74.84,74.84,0,0,0,192,144v58.35a8,8,0,0,1-14.69,4.38l-10.68-16.31c-.08-.12-.16-.25-.23-.38a12,12,0,0,0-20.89,11.83l22.13,33.79a8,8,0,0,1-13.39,8.76l-22.26-34-.24-.38A28,28,0,0,1,176,176.4V64H160a8,8,0,0,1,0-16h16a16,16,0,0,1,16,16v59.62A90.89,90.89,0,0,1,232,198.65ZM88,56a8,8,0,0,0-8-8H64A16,16,0,0,0,48,64V200a8,8,0,0,0,16,0V64H80A8,8,0,0,0,88,56Zm69.66,42.34a8,8,0,0,0-11.32,0L128,116.69V16a8,8,0,0,0-16,0V116.69L93.66,98.34a8,8,0,0,0-11.32,11.32l32,32a8,8,0,0,0,11.32,0l32-32A8,8,0,0,0,157.66,98.34Z'></path>
      </svg>
    )
  },
  {
    svg: (
      <svg className={`w-8 h-8`} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>
        <path d='M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z'></path>
      </svg>
    )
  }
]

export default function StyledStepperPurchase({
  orderStatus,
  isRating,
  orientation
}: {
  orderStatus: OrderStatus
  isRating: boolean
  orientation: 'vertical' | 'horizontal'
}) {
  const [activeStep, setActiveStep] = useState<number>(getStepFromStatus(orderStatus, isRating))
  console.log(activeStep)
  const fillColorOnStep = (svgElement: React.ReactElement, step: number) => {
    const fillColor = step < activeStep ? 'fill-white' : step === activeStep ? 'fill-blue' : 'fill-gray-500'
    return cloneElement(svgElement, {
      className: `${svgElement.props.className || ''} ${fillColor}`
    })
  }

  return (
    <StyledForStepper orientation={orientation} size='xl' active={activeStep}>
      {arrayIconStatusPurchase.map((svgElement, index) => (
        <Stepper.Step
          key={index}
          icon={fillColorOnStep(svgElement.svg, index)} // index ứng với step luôn
          completedIcon={fillColorOnStep(svgElement.svg, index)}
        ></Stepper.Step>
      ))}
    </StyledForStepper>
  )
}
