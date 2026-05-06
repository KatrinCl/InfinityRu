import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import type { Product as ProductType } from '../types'
import { getImageSrc } from '../utils/imageSrc'

const Product = () => {
  const { productId } = useParams()
  const { products, getCartItemCount, addToCart, removeFromCart, backendUrl } = useAppContext()

  const [productData, setProductData] = useState<ProductType | null>(null)

  const quantity = getCartItemCount(productId || '')

  useEffect(() => {
    const product = products.find((item) => String(item.id) === String(productId))

    if (product) {
      setProductData(product)
    }
  }, [productId, products])

  if (!productData) return null

  return (
    <div className='flex flex-col gap-5 mx-4 md:mx-10 my-6'>
      {/* BACK */}
      <div className='flex items-center gap-2 bg-red-100/40 px-3 py-2 rounded-lg w-fit'>
        <img src={assets.simbol} className='w-4' />
        <Link to='/menu' className='text-red-600'>
          Вернуться в меню
        </Link>
      </div>

      {/* MAIN */}
      <div className='flex flex-col md:flex-row gap-6'>
        {/* LEFT */}
        <div className='flex flex-col w-full md:w-1/2 gap-4'>
          {productData.image?.map((img: string, index: number) => (
            <img key={index} src={getImageSrc(backendUrl, img)} className='w-full rounded-2xl' />
          ))}

          <div className='flex gap-3'>
            <div className='flex flex-col gap-2 bg-gray-100 rounded-xl p-4 w-1/2'>
              <p>Пищевая ценность 100г</p>
              <p className='font-semibold'>{productData.weight1}</p>
            </div>

            <div className='flex flex-col gap-2 bg-gray-100 rounded-xl p-4 w-1/2'>
              <p>Пищевая ценность порция</p>
              <p className='font-semibold'>{productData.weight2}</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className='flex flex-col w-full md:w-1/2 bg-gray-100 rounded-2xl p-6 gap-4'>
          <h2 className='text-2xl md:text-3xl font-semibold'>{productData.name}</h2>

          <p className='text-gray-500'>Вес: {productData.weight} г</p>

          <p className='text-gray-700'>Состав: {productData.composition}</p>

          {/* CART */}
          <div className='flex items-center justify-between mt-auto'>
            {/* COUNT */}
            <div className='flex items-center gap-3'>
              <img onClick={() => removeFromCart(productData.id)} src={assets.circle_minus} className='w-6 cursor-pointer' />

              <p className='text-lg'>{quantity}</p>

              <img onClick={() => addToCart(productData.id)} src={assets.circle_plus} className='w-6 cursor-pointer' />
            </div>

            {/* ADD BUTTON */}
            <button onClick={() => addToCart(productData.id)} className='bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-400 transition flex justify-between items-center gap-3 cursor-pointer'>
              <span>В корзину</span>
              <span className='font-semibold'>{productData.price} ₽</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product
