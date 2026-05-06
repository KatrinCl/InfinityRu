import { useState, type FormEvent, type MouseEvent } from 'react'
import { toast } from 'react-toastify'
import { useAppContext } from '../context/AppContext'

const Login = () => {
  const { setUser, setShowUserLogin, navigate, backendUrl, axios } = useAppContext()

  const [state, setState] = useState<'login' | 'register'>('login')
  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [email, setEmail] = useState<string>('')

  const onSubmitHandler = async (event: FormEvent) => {
    event.preventDefault()

    if (state === 'register' && !name.trim()) {
      toast.error('Введите имя')
      return
    }

    if (!email.includes('@')) {
      toast.error('Введите корректный email')
      return
    }

    if (password.length < 8) {
      toast.error('Пароль должен содержать минимум 8 символов')
      return
    }

    try {
      const url = state === 'register' ? '/api/user/register' : '/api/user/login'

      const { data } = await axios.post(backendUrl + url, {
        name,
        email,
        password,
      })

      if (data.success) {
        setUser(data.user)
        setShowUserLogin(false)
        toast.success(state === 'register' ? 'Регистрация успешна!' : 'Вход выполнен!')
        navigate('/')
      } else {
        toast.error(data.message || 'Ошибка')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка соединения')
    }
  }

  const closeModal = () => setShowUserLogin(false)

  const stopPropagation = (e: MouseEvent<HTMLFormElement>) => {
    e.stopPropagation()
  }

  return (
    <div onClick={closeModal} className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <form onSubmit={onSubmitHandler} onClick={stopPropagation} className='flex flex-col gap-4 w-[90%] max-w-[360px] bg-white p-8 rounded-xl shadow-lg'>
        <p className='text-2xl font-medium text-center'>{state === 'login' ? 'Авторизация' : 'Регистрация'}</p>

        {state === 'register' && (
          <div className='w-full'>
            <p className='text-sm text-gray-600'>Имя</p>
            <input value={name} onChange={e => setName(e.target.value)} placeholder='Введите имя' className='w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-300' type='text' required />
          </div>
        )}

        <div className='w-full'>
          <p className='text-sm text-gray-600'>Email</p>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder='Введите email' className='w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-300' type='email' required />
        </div>

        <div className='w-full'>
          <p className='text-sm text-gray-600'>Пароль</p>
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder='Введите пароль' className='w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-300' type='password' required />
        </div>

        {state === 'register' ? (
          <p className='text-sm'>
            Уже есть аккаунт?{' '}
            <span onClick={() => setState('login')} className='text-red-500 cursor-pointer hover:underline'>
              нажми здесь
            </span>
          </p>
        ) : (
          <p className='text-sm'>
            Создать аккаунт?{' '}
            <span onClick={() => setState('register')} className='text-red-500 cursor-pointer hover:underline'>
              нажми здесь
            </span>
          </p>
        )}

        <button type='submit' className='w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer'>
          {state === 'register' ? 'Создать аккаунт' : 'Авторизация'}
        </button>
      </form>
    </div>
  )
}

export default Login
