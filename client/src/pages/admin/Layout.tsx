import { useEffect, useState } from 'react'
import axios from 'axios'
import { Navigate, Outlet } from 'react-router-dom'
import Navbar from '../../components/admin/Navbar'
import Sidebar from '../../components/admin/Sidebar'

const Layout = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false)
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string

  useEffect(() => {
    let isMounted = true

    const checkAdminAuth = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/check`, {
          withCredentials: true,
        })
        if (isMounted) {
          setIsAdminAuthorized(Boolean(data.success))
        }
      } catch {
        if (isMounted) {
          setIsAdminAuthorized(false)
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false)
        }
      }
    }

    void checkAdminAuth()

    return () => {
      isMounted = false
    }
  }, [backendUrl])

  if (isCheckingAuth) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 text-gray-600'>
        Проверяем доступ...
      </div>
    )
  }

  if (!isAdminAuthorized) {
    return <Navigate to='/admin/login' replace />
  }

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <Navbar />
      <div className='flex flex-1'>
        <Sidebar />
        <main className='flex-1 p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout