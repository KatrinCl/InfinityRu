import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import PlaceOrder from '../components/PlaceOrder'
import { assets } from '../assets/assets'
import type { Product } from '../types'
import { getImageSrc } from '../utils/imageSrc'

type CartItem = Omit<Product, 'image'> & {
  quantity: number
  totalPrice: number
  image: string
}

const Cart = () => {
  const { cartItems, removeFromCart, addToCart, getCartItemCount, backendUrl, products, navigate } = useAppContext()

  const [cartData, setCartData] = useState<CartItem[]>([])

  useEffect(() => {
    const tempData: CartItem[] = []

    for (const itemId in cartItems) {
      const quantity = cartItems[itemId]

      if (quantity > 0) {
        const productData = products.find((p) => p.id === Number(itemId))

        if (productData) {
          const image = Array.isArray(productData.image) ? productData.image[0] : ''
          tempData.push({
            ...productData,
            image,
            quantity,
            totalPrice: productData.price * quantity,
          })
        }
      }
    }

    setCartData(tempData)
  }, [cartItems, products])

  return (
    <div className='flex flex-col gap-6 px-4 md:px-10 py-5 min-h-screen'>
      <h1 className='text-xl md:text-2xl font-semibold'>Корзина</h1>

      {/* BACK */}
      <Link to='/' className='flex items-center gap-2 bg-red-100 px-3 py-2 rounded-lg w-fit'>
        <img src={assets.simbol} className='w-4 md:w-5' />
        <p className='text-red-500 text-sm md:text-base'>Вернуться в меню</p>
      </Link>

      <div className='flex flex-col lg:flex-row gap-10'>
        {/* ITEMS */}
        <div className='flex flex-col gap-5 flex-1'>
          {cartData.map(item => (
            <div key={item.id} className='flex gap-4 border-b pb-4'>
              <img
                src={getImageSrc(backendUrl, item.image)}
                onClick={() => navigate(`/product/${item.id}`)}
                className='w-[120px] h-[100px] md:w-[160px] md:h-[130px] object-cover rounded-lg cursor-pointer'
              />

              <div className='flex flex-col justify-between flex-1'>
                <div className='flex justify-between items-center'>
                  <p className='text-sm md:text-lg'>{item.name}</p>
                  <img src={assets.cross_icon} onClick={() => removeFromCart(item.id)} className='w-4 cursor-pointer' />
                </div>

                <div className='flex justify-between items-center'>
                  <div className='flex items-center gap-2 md:gap-3'>
                    <img src={assets.circle_minus} onClick={() => removeFromCart(item.id)} className='w-4 md:w-5 cursor-pointer' />
                    <p>{getCartItemCount(item.id)}</p>
                    <img src={assets.circle_plus} onClick={() => addToCart(item.id)} className='w-4 md:w-5 cursor-pointer' />
                  </div>

                  <p className='text-sm md:text-lg font-semibold'>{item.totalPrice} ₽</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FORM */}
        <div className='w-full lg:max-w-[400px]'>
          <PlaceOrder />
        </div>
      </div>
    </div>
  )
}

export default Cart
