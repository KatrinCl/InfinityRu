import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { getImageSrc } from '../../utils/imageSrc'

type OrderStatus = 'pending' | 'completed' | 'cancelled'

type OrderItem = {
  id: number
  name: string
  price: number
  image: string[] | string
  quantity: number
}

type Order = {
  id: number
  items: OrderItem[]
  amount: number
  status: OrderStatus | string
  address: {
    name: string
    phone: string
    street: string
    deliveryTime?: string
    comment?: string
  }
  paymentMethod: string
  createdAt: string
}

const Orders = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string

  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [statusById, setStatusById] = useState<Record<number, OrderStatus>>({})
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const statusOptions = useMemo(
    () =>
      [
        { value: 'pending' as const, label: 'pending' },
        { value: 'completed' as const, label: 'completed' },
        { value: 'cancelled' as const, label: 'cancelled' },
      ] as const,
    [],
  )

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/order/list`, {
        withCredentials: true,
      })

      if (data?.success && Array.isArray(data.orders)) {
        setOrders(data.orders as Order[])
      } else {
        toast.error(data?.message || 'Не удалось загрузить заказы')
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Ошибка загрузки заказов')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendUrl])

  const getItemPreviewImage = (img: OrderItem['image']) => {
    if (Array.isArray(img)) return img[0]
    return img
  }

  const saveStatus = async (orderId: number) => {
    const nextStatus = statusById[orderId]
    if (!nextStatus) return

    setUpdatingId(orderId)
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: nextStatus },
        { withCredentials: true },
      )

      if (res.data?.success) {
        toast.success('Статус заказа обновлён')
        await fetchOrders()
        setStatusById((prev) => {
          const copy = { ...prev }
          delete copy[orderId]
          return copy
        })
      } else {
        toast.error(res.data?.message || 'Не удалось обновить статус')
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Ошибка обновления статуса')
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white'
      case 'cancelled':
        return 'bg-red-500 text-white'
      default:
        return 'bg-yellow-400 text-black'
    }
  }

  return (
    <section className='flex flex-col gap-4'>
      <h1 className='text-2xl font-semibold'>Заказы</h1>

      {isLoading ? (
        <div className='bg-white border rounded-lg p-4 text-gray-600'>Загрузка...</div>
      ) : (
        <div className='bg-white border rounded-lg p-4 text-gray-600 flex flex-col gap-4'>
          {orders.length === 0 ? (
            <div>Заказов пока нет.</div>
          ) : (
            orders.map((order) => {
              const selectedStatus = statusById[order.id] ?? (order.status as OrderStatus)

              return (
                <div key={order.id} className='border rounded-xl p-4 shadow-sm bg-gray-50'>
                  <div className='flex justify-between items-center mb-3 gap-3'>
                    <h3 className='text-base md:text-lg font-medium'>
                      Заказ #{String(order.id).padStart(6, '0')}
                    </h3>

                    <div className='flex items-center gap-3'>
                      <span
                        className={`px-2 py-1 rounded text-xs md:text-sm font-semibold ${getStatusStyle(
                          selectedStatus,
                        )}`}
                      >
                        {selectedStatus}
                      </span>
                      <div className='text-xs md:text-sm font-medium text-gray-600'>
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className='text-sm text-gray-700 mb-3 space-y-1'>
                    <p>
                      <strong>Имя:</strong> {order.address?.name}
                    </p>
                    <p>
                      <strong>Телефон:</strong> {order.address?.phone}
                    </p>
                    <p>
                      <strong>Адрес:</strong> {order.address?.street}
                    </p>
                    {order.address?.deliveryTime && (
                      <p>
                        <strong>Ко времени:</strong> {order.address.deliveryTime}
                      </p>
                    )}
                    {order.address?.comment && (
                      <p>
                        <strong>Комментарий:</strong> {order.address.comment}
                      </p>
                    )}
                    <p>
                      <strong>Оплата:</strong> {order.paymentMethod}
                    </p>
                  </div>

                  <div className='border-t pt-3 flex flex-col gap-3'>
                    {order.items?.map((item) => (
                      <div key={item.id} className='flex gap-3 items-center'>
                        <img
                          src={getImageSrc(backendUrl, getItemPreviewImage(item.image))}
                          className='w-14 h-14 md:w-16 md:h-16 object-cover rounded-md'
                        />

                        <div className='flex-1'>
                          <p className='text-sm md:text-base'>{item.name}</p>
                          <p className='text-xs text-gray-500'>
                            {item.quantity} × {item.price} ₽
                          </p>
                        </div>

                        <p className='text-sm font-semibold'>{item.price * item.quantity} ₽</p>
                      </div>
                    ))}
                  </div>

                  <div className='flex items-center justify-between mt-4 gap-4'>
                    <div className='text-right font-semibold'>Итого: {order.amount} ₽</div>

                    <div className='flex items-center gap-2'>
                      <select
                        className='border rounded-md px-2 py-1 bg-white'
                        value={selectedStatus}
                        onChange={(e) =>
                          setStatusById((prev) => ({
                            ...prev,
                            [order.id]: e.target.value as OrderStatus,
                          }))
                        }
                        disabled={updatingId === order.id}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => void saveStatus(order.id)}
                        className='px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50 cursor-pointer'
                        disabled={updatingId === order.id}
                      >
                        {updatingId === order.id ? 'Сохранение...' : 'Сохранить'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </section>
  )
}

export default Orders