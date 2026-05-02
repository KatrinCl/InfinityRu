import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Location = () => {
  return (
    <div className='flex flex-col'>
      <div className='flex justify-center my-6'>
        <Link to='/'>
          <img src={assets.logo} className='w-28 md:w-40' />
        </Link>
      </div>

      <div className='flex flex-col gap-10 mb-10'>

        <div className='flex flex-col md:flex-row justify-between bg-red-200/60 rounded-2xl w-[92%] md:w-[80%] mx-auto min-h-[280px]'>
          <div className='flex flex-col gap-3 p-6 md:m-12'>
            <h1 className='text-red-600 text-2xl md:text-4xl'>Москва</h1>
            <p className='text-red-500 text-lg md:text-xl'>доставка</p>
            <p className='text-gray-700'>пн-вс 10:00-18:00</p>
          </div>

          <div className='flex flex-col gap-3 p-6 md:m-12 md:text-right'>
            <p className='text-red-500 text-lg md:text-xl'>г. Москва, ул. Примерная, д. 123</p>
            <p className='text-gray-700'>пн-вс с 10:00 до 20:00</p>
          </div>
        </div>

        <div className='flex flex-col md:flex-row justify-between bg-red-200/60 rounded-2xl w-[92%] md:w-[80%] mx-auto min-h-[280px]'>
          <div className='flex flex-col gap-3 p-6 md:m-12'>
            <h1 className='text-red-600 text-2xl md:text-4xl'>Иваново</h1>
            <p className='text-red-500 text-lg md:text-xl'>доставка</p>
            <p className='text-gray-700'>пн-вс 10:00-18:00</p>
          </div>

          <div className='flex flex-col gap-3 p-6 md:m-12 md:text-right'>
            <p className='text-red-500 text-lg md:text-xl'>ул. Садовая, 4</p>
            <p className='text-gray-700'>пн-пт 9:00-21:00</p>
            <p className='text-red-500 text-lg md:text-xl'>проспект Ленина, 8</p>
            <p className='text-gray-700'>пн-вс 10:00-20:00</p>
          </div>
        </div>

        <div className='flex flex-col md:flex-row justify-between bg-red-200/60 rounded-2xl w-[92%] md:w-[80%] mx-auto min-h-[280px]'>
          <div className='flex flex-col gap-3 p-6 md:m-12'>
            <h1 className='text-red-600 text-2xl md:text-4xl'>Ярославль</h1>
            <p className='text-red-500 text-lg md:text-xl'>доставка</p>
            <p className='text-gray-700'>пн-вс 10:00-18:00</p>
          </div>

          <div className='flex flex-col gap-3 p-6 md:m-12 md:text-right'>
            <p className='text-red-500 text-lg md:text-xl'>ул. Комсомольская, 4</p>
            <p className='text-gray-700'>пн-вс 10:00-22:00</p>
            <p className='text-red-500 text-lg md:text-xl'>ул. Свободы, 1</p>
            <p className='text-gray-700'>пн-вс 9:00-21:00</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Location
