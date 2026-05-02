import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

type AdminMetrics = {
  ordersToday: number
  newUsers: number
  productsInMenu: number
}

const Dashboard = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string

  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/metrics`, {
          withCredentials: true,
        })

        if (data?.success && data?.metrics) {
          setMetrics(data.metrics as AdminMetrics)
        } else {
          toast.error(data?.message || 'Не удалось загрузить метрики')
        }
      } catch (e: any) {
        toast.error(e?.response?.data?.message || 'Ошибка загрузки метрик')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchMetrics()
  }, [backendUrl])

  return (
    <section className='flex flex-col gap-4'>
      <h1 className='text-2xl font-semibold'>Dashboard</h1>

      {isLoading ? (
        <div className='bg-white border rounded-lg p-4 text-gray-600'>Загрузка...</div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-white rounded-lg border p-4'>
            <p className='text-gray-500'>Заказы сегодня</p>
            <p className='text-2xl font-semibold mt-2'>{metrics?.ordersToday ?? 0}</p>
          </div>
          <div className='bg-white rounded-lg border p-4'>
            <p className='text-gray-500'>Новых пользователей</p>
            <p className='text-2xl font-semibold mt-2'>{metrics?.newUsers ?? 0}</p>
          </div>
          <div className='bg-white rounded-lg border p-4'>
            <p className='text-gray-500'>Товаров в меню</p>
            <p className='text-2xl font-semibold mt-2'>{metrics?.productsInMenu ?? 0}</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default Dashboard