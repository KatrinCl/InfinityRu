import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import type { Product } from '../types'
import { getImageSrc } from '../utils/imageSrc'

type ProductItemProps = Pick<Product, 'id' | 'name' | 'price' | 'image'>

const ProductItem = ({ id, name, price, image }: ProductItemProps) => {
  const { addToCart, removeFromCart, getCartItemCount, backendUrl } = useAppContext()
  const quantity = getCartItemCount(id)
  const previewImage = Array.isArray(image) ? image[0] : image
  const imageSrc = getImageSrc(backendUrl, previewImage)

  return (
    <div className='flex flex-col w-full max-w-[260px] rounded-2xl overflow-hidden hover:bg-red-100 transition'>
      {/* IMAGE */}
      <Link to={`/product/${id}`} className='w-full'>
        <img src={imageSrc} alt={name} className='w-full h-[200px] md:h-[220px] object-cover' />
      </Link>

      {/* INFO */}
      <div className='flex flex-col gap-3 p-3 flex-grow'>
        <p className='text-base md:text-lg italic min-h-[40px]'>{name}</p>

        <div className='flex justify-between items-center'>
          {/* COUNT */}
          <div className='flex items-center gap-3'>
            <img src={assets.circle_minus} onClick={() => removeFromCart(id)} className={`w-5 cursor-pointer ${quantity === 0 ? 'opacity-30 pointer-events-none' : ''}`} />
            <p className='text-lg'>{quantity}</p>
            <img src={assets.circle_plus} onClick={() => addToCart(id)} className='w-5 cursor-pointer' />
          </div>

          {/* PRICE */}
          <p className='text-lg font-semibold'>{price} ₽</p>
        </div>
      </div>

      {/* BUTTON */}
      <div onClick={() => addToCart(id)} className='m-3 mt-auto border border-red-500 rounded-lg py-2 text-center text-red-500 cursor-pointer hover:bg-red-500 hover:text-white transition'>
        {quantity > 0 ? 'В корзине' : 'В корзину'}
      </div>
    </div>
  )
}

export default ProductItem
