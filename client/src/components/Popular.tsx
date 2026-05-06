import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import ProductItem from './ProductItem'
import type { Product } from '../types'

const Popular = () => {
  const { products } = useAppContext()

  const [popular, setPopular] = useState<Product[]>([])

  useEffect(() => {
    const popularProduct = products.filter((item) => item.popular)
    setPopular(popularProduct.slice(0, 4))
  }, [products])

  return (
    <div className='mx-5 md:mx-16 md:my-10'>
      <div className='flex flex-col gap-5 my-6'>
        <h1 className='text-xl md:text-2xl font-semibold mx-4 md:mx-6'>Популярное</h1>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {popular.map((item, index) => (
            <ProductItem key={index} id={item.id} name={item.name} price={item.price} image={item.image} />
          ))}
        </div>

        <div className='flex justify-center'>
          <Link to='/menu' onClick={() => scrollTo(0, 0)} className='border border-red-500 text-red-500 px-6 py-3 rounded-xl hover:bg-red-500 hover:text-white transition'>
            Перейти к меню
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Popular
