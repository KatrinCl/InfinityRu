import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className="flex min-h-[50vh] bg-[url('/footer1.jpg')] bg-cover bg-center rounded-xl">
      <div className='flex flex-col w-full m-5 md:m-10 gap-6 md:gap-8'>

        <div className='flex flex-wrap justify-center items-center gap-6 md:gap-10 text-white'>
          <Link to='/menu'>
            <p className='text-lg md:text-xl italic cursor-pointer hover:underline hover:decoration-wavy'>меню</p>
          </Link>

          <img src={assets.dot_white} className='w-8 md:w-12' />

          <Link to='/conditions'>
            <p className='text-lg md:text-xl italic cursor-pointer hover:underline hover:decoration-wavy'>условия доставки</p>
          </Link>

          <img src={assets.dot_white} className='w-8 md:w-12' />

          <p className='text-lg md:text-xl italic cursor-pointer hover:underline hover:decoration-wavy'>бонусная карта</p>

          <img src={assets.dot_white} className='w-8 md:w-12' />

          <p className='text-lg md:text-xl italic cursor-pointer hover:underline hover:decoration-wavy'>рестораны</p>

          <img src={assets.dot_white} className='w-8 md:w-12' />

          <Link to='/about'>
            <p className='text-lg md:text-xl italic cursor-pointer hover:underline hover:decoration-wavy'>о нас</p>
          </Link>

          <img src={assets.dot_white} className='w-8 md:w-12' />

          <p className='text-lg md:text-xl italic cursor-pointer hover:underline hover:decoration-wavy'>отзывы</p>
        </div>

        <img src={assets.vk} className='w-10 md:w-14' />

        <div className='flex flex-col md:flex-row justify-between text-gray-200 gap-4 md:gap-0'>
          <div className='flex flex-col gap-2 text-sm md:text-base text-center md:text-left'>
            <p>© 2016-2025 Сеть ресторанов "Infinity"</p>
            <p>www.restoraninfinity.ru</p>
            <p>г. Москва, ул. Примерная, д. 123</p>
            <p>+7 (901)-285-3563</p>
          </div>

          <div className='flex flex-col gap-2 text-sm md:text-base text-center md:text-right'>
            <p>Онлайн оплата</p>
            <p>
              Положение о конфиденциальности <br />и защите персональных данных
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
