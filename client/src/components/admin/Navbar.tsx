import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
  const navigate = useNavigate()
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string

  const logout = async () => {
    try {
      await axios.get(`${backendUrl}/api/admin/logout`, {
        withCredentials: true,
      })
      toast.success('Вы вышли из админ-панели')
    } catch {
      toast.error('Не удалось выйти корректно')
    } finally {
      navigate('/admin/login')
    }
  }

  return (
    <header className='h-16 px-6 flex items-center justify-between border-b bg-white'>
      <p className='text-lg font-semibold'>Infinity Admin Panel</p>
      <button
        onClick={logout}
        className='px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition'
      >
        Выйти
      </button>
    </header>
  )
}

export default Navbar