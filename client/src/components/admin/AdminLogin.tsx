import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim() || !password.trim()) {
      toast.error('Введите email и пароль')
      return
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password }, { withCredentials: true })

      if (data.success) {
        toast.success('Вход выполнен')
        navigate('/admin')
        return
      }

      toast.error(data.message || 'Неверные данные')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка соединения')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <form onSubmit={onSubmit} className='w-full max-w-sm bg-white rounded-xl shadow p-6 flex flex-col gap-4'>
        <h1 className='text-xl font-semibold'>Вход администратора</h1>
        <input value={email} onChange={e => setEmail(e.target.value)} type='email' placeholder='Email' className='border rounded-md px-3 py-2' />
        <input value={password} onChange={e => setPassword(e.target.value)} type='password' placeholder='Пароль' className='border rounded-md px-3 py-2' />
        <button type='submit' className='bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition cursor-pointer'>
          Войти
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
