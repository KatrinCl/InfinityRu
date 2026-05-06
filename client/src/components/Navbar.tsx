import { useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Navbar = () => {
  const { getCartCount, navigate, user, setUser, setCartItems, axios, setShowUserLogin, backendUrl } = useAppContext()

  const [showContactModal, setShowContactModal] = useState<boolean>(false)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const toggleContactModal = () => setShowContactModal(prev => !prev)
  const toggleMenu = () => setIsMenuOpen(prev => !prev)
  const closeMobileMenu = () => setIsMenuOpen(false)

  const handleOutsideClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowContactModal(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/logout`)
      if (data.success) {
        toast.success(data.message)
        setUser(null)
        setCartItems({})
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className='flex flex-col px-5 md:px-10'>
      <div className='flex justify-between items-center'>

        <div className='md:hidden flex flex-col justify-between w-5 h-5 cursor-pointer z-[1001]' onClick={toggleMenu}>
          <div className={`h-[3px] bg-gray-800 transition ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`h-[3px] bg-gray-800 transition ${isMenuOpen ? 'opacity-0' : ''}`} />
          <div className={`h-[3px] bg-gray-800 transition ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </div>

        <div className='hidden md:flex gap-2 items-center cursor-pointer'>
          <img src='./logo3.jpg' className='w-[190px] h-[170px]' />
          <div className='flex flex-col gap-2 justify-center'>
            <p className='text-red-500 font-semibold'>ДОСТАВКА</p>
            <p>ПН/ВС 10:00/18:00</p>
            <p className='text-gray-500 text-sm'>*заказы принимаем только на сайте</p>
          </div>
        </div>

        <Link to='/'>
          <img src={assets.logo} className='w-[60px] md:w-[220px]' />
        </Link>

        <div className='flex gap-6 md:gap-12 items-center text-sm md:text-lg'>
          <Link to='/location' className='flex flex-col items-center'>
            <img src={assets.location} className='w-8 md:w-12' />
            <p className='hidden md:block'>Москва</p>
          </Link>

          <div onClick={toggleContactModal} className='hidden md:flex flex-col items-center cursor-pointer hover:opacity-70 transition'>
            <img src='./call.svg' className='w-8 md:w-12' />
            <p>Связаться</p>
          </div>

          <div className='text-center cursor-pointer hover:opacity-70 transition'>
            <Link to='/cart' className='relative inline-block'>
              <img src='./cart_icon.svg' className='w-8 md:w-12' />
              <span className='absolute top-4 md:top-6 -right-4 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'>{getCartCount()}</span>
            </Link>
            <p className='hidden md:block'>Корзина</p>
          </div>

          {!user ? (
            <div onClick={() => setShowUserLogin(true)} className='flex flex-col items-center cursor-pointer hover:opacity-70 transition'>
              <img src='./home.svg' className='w-6 md:w-12' />
              <p>Войти</p>
            </div>
          ) : (
            <div className='relative group cursor-pointer hover:opacity-80 transition'>
              <img src='./profile_icon.png' className='w-10 h-10 md:w-16 md:h-16' />

              <div className='absolute right-0 mt-2 w-32 bg-white border rounded shadow opacity-100 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200'>
                <ul>
                  <li onClick={() => navigate('/orders')} className='px-4 py-2 hover:bg-blue-100 cursor-pointer first:rounded-t'>
                    Заказы
                  </li>
                  <li onClick={logout} className='px-4 py-2 hover:bg-blue-100 cursor-pointer last:rounded-b'>
                    Выйти
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='hidden md:flex justify-center items-center gap-12 py-3'>
        <Link to='/menu' className='cursor-pointer'>
          <p className='text-xl italic hover:text-red-500 hover:underline hover:decoration-wavy'>меню</p>
        </Link>
        <img src={assets.dot_red} className='w-10' />

        <Link to='/conditions' className='cursor-pointer'>
          <p className='text-xl italic hover:text-red-500 hover:underline hover:decoration-wavy'>условия доставки</p>
        </Link>
        <img src={assets.dot_red} className='w-10' />

        <p className='text-xl italic cursor-pointer hover:underline hover:decoration-wavy hover:text-red-500'>бонусная карта</p>
        <img src={assets.dot_red} className='w-10' />

        <p className='text-xl italic cursor-pointer hover:underline hover:decoration-wavy hover:text-red-500'>рестораны</p>
        <img src={assets.dot_red} className='w-10' />

        <Link to='/about' className='cursor-pointer'>
          <p className='text-xl italic hover:text-red-500 hover:underline hover:decoration-wavy'>о нас</p>
        </Link>

        <img src={assets.dot_red} className='w-10' />
        <p className='text-xl italic cursor-pointer hover:underline hover:decoration-wavy hover:text-red-500'>отзывы</p>
      </div>

      {showContactModal && (
        <div onClick={handleOutsideClick} className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'>
          <div className='bg-white p-10 rounded-xl w-[400px] max-w-[90%] relative'>
            <span onClick={toggleContactModal} className='absolute top-3 right-4 text-2xl cursor-pointer'>
              X
            </span>

            <div className='space-y-4'>
              <p>
                <strong>Телефон:</strong> +7 (901) 285-35-63
              </p>
              <p>
                <strong>Email:</strong> info@infinity.com
              </p>
              <p>
                <strong>Часы работы:</strong> ПН-ВС 10:00-18:00
              </p>
              <p>
                <strong>Адрес:</strong> г. Москва, ул. Примерная, д. 123
              </p>
            </div>
          </div>
        </div>
      )}
      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 left-0 h-full w-[80%] bg-white md:hidden p-6 transition-transform duration-300 z-[999]
  ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className='flex flex-col gap-6 mt-16 text-md'>
          <Link to='/menu' onClick={closeMobileMenu} className='cursor-pointer hover:text-red-500 transition'>
            меню
          </Link>

          <Link to='/conditions' onClick={closeMobileMenu} className='cursor-pointer hover:text-red-500 transition'>
            условия доставки
          </Link>

          <p onClick={closeMobileMenu} className='cursor-pointer hover:text-red-500 transition'>
            бонусная карта
          </p>
          <p onClick={closeMobileMenu} className='cursor-pointer hover:text-red-500 transition'>
            рестораны
          </p>

          <Link to='/about' onClick={closeMobileMenu} className='cursor-pointer hover:text-red-500 transition'>
            о нас
          </Link>

          <p onClick={closeMobileMenu} className='cursor-pointer hover:text-red-500 transition'>
            отзывы
          </p>

          <div
            onClick={() => {
              closeMobileMenu()
              toggleContactModal()
            }}
            className='flex items-center gap-3 mt-6 bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition'>
            <img src='./call.svg' className='w-5' />
            <p>Связаться</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
