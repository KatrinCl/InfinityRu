import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductItem from '../components/ProductItem'
import { assets } from '../assets/assets'

const Menu = () => {
  const { products } = useAppContext()

  const [selectedCategory, setSelectedCategory] = useState<string>('Все')

  const categories = ['Все', ...new Set(products.map(item => item.category))]

  const filteredProducts = selectedCategory === 'Все' ? products : products.filter(item => item.category === selectedCategory)

  return (
    <div className='flex flex-col m-2'>
      {/* BANNER */}
      <img src={assets.menu} className='w-full mx-auto rounded-xl' />

      {/* CATEGORIES */}
      <div className='flex flex-wrap gap-4 md:gap-6 m-4 md:m-6'>
        {categories.map((category, index) => (
          <p
            key={index}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 md:px-5 md:py-3 rounded-full italic cursor-pointer transition
              ${selectedCategory === category ? 'bg-red-500 text-white' : 'bg-red-200 hover:bg-red-500 hover:text-white'}
            `}>
            {category}
          </p>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className='flex flex-wrap gap-5 justify-center items-center m-4'>
        {filteredProducts.map((item, index: number) => (
          <ProductItem key={index} id={item.id} name={item.name} price={item.price} image={item.image} />
        ))}
      </div>
    </div>
  )
}

export default Menu
