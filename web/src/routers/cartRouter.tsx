import { Suspense } from 'react'
import path from 'src/constants/path'
import CartLayout from 'src/layouts/CartLayout'
import Cart from 'src/pages/Cart'

const cartRouter = {
  path: path.cart,
  element: (
    <CartLayout>
      <Suspense>
        <Cart></Cart>
      </Suspense>
    </CartLayout>
  )
}

export default cartRouter
