import { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { getImageSrc } from '../utils/imageSrc'

interface OrderItem {
  id: number
  name: string
  price: number
  image: string[] | string
  quantity: number
}

interface Order {
  id: number
  items: OrderItem[]
  amount: number
  status: 'pending' | 'completed' | 'cancelled'
  address: {
    name: string
    phone: string
    street: string
    deliveryTime?: string
    comment?: string
  }
  date: string
}

const Orders = () => {
  const { axios, backendUrl } = useAppContext()
  const [orders, setOrders] = useState<Order[]>([])

  // Маппинг статусов: eng -> русский
  const statusLabels: Record<string, string> = {
    'pending': 'В обработке',
    'collecting': 'Собираем',
    'in-transit': 'В пути',
    'delivered': 'Доставлено',
    'completed': 'Доставлено',
    'cancelled': 'Отменён',
  }

  const fetchOrders = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/order/orders`)
      if (data.success) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return 'bg-green-500 text-white'
      case 'cancelled':
        return 'bg-red-500 text-white'
      case 'collecting':
        return 'bg-blue-500 text-white'
      case 'in-transit':
        return 'bg-purple-500 text-white'
      default:
        return 'bg-yellow-400 text-black'
    }
  }

  const getItemPreviewImage = (img: OrderItem['image']) => {
    if (Array.isArray(img)) return img[0]
    return img
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6'>
      <h1 className='text-xl md:text-2xl font-semibold'>Мои заказы</h1>

      <div className='flex flex-col gap-6'>
        {orders.map(order => (
          <div key={order.id} className='border rounded-xl p-4 shadow-sm bg-gray-50'>
            {/* HEADER */}
            <div className='flex justify-between items-center mb-3'>
              <h3 className='text-base md:text-lg font-medium'>Заказ #{String(order.id).padStart(6, '0')}</h3>

              <span className={`px-2 py-1 rounded text-xs md:text-sm font-semibold ${getStatusStyle(order.status)}`}>{statusLabels[order.status] || order.status}</span>
            </div>

            {/* DETAILS */}
            <div className='text-sm text-gray-600 mb-3 space-y-1'>
              <p>
                <strong>Имя:</strong> {order.address.name}
              </p>
              <p>
                <strong>Телефон:</strong> {order.address.phone}
              </p>
              <p>
                <strong>Адрес:</strong> {order.address.street}
              </p>
              {order.address.deliveryTime && (
                <p>
                  <strong>Ко времени:</strong> {order.address.deliveryTime}
                </p>
              )}
              {order.address.comment && (
                <p>
                  <strong>Комментарий:</strong> {order.address.comment}
                </p>
              )}
            </div>

            {/* ITEMS */}
            <div className='border-t pt-3 flex flex-col gap-3'>
              {order.items.map(item => (
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

            {/* TOTAL */}
            <div className='text-right mt-4 font-semibold'>Итого: {order.amount} ₽</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
