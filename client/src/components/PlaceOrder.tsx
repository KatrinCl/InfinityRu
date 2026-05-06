import { useState, type ChangeEvent, type FormEvent } from 'react'
import { toast } from 'react-toastify'
import { useAppContext } from '../context/AppContext'
import type { Product } from '../types'

// Подключаем Stripe.js динамически
const loadStripeScript = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).Stripe) {
      resolve((window as any).Stripe)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/'
    script.onload = () => resolve((window as any).Stripe)
    script.onerror = () => reject(new Error('Failed to load Stripe.js'))
    document.head.appendChild(script)
  })
}

const PlaceOrder = () => {
  const { getCartAmount, backendUrl, axios, setCartItems, cartItems, navigate, products } = useAppContext()
  const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

  const [method, setMethod] = useState<string>('cash')
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    deliveryTime: '',
    comment: '',
  })

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (method === 'online' && !stripePublishableKey) {
      return toast.error('Онлайн-оплата временно недоступна')
    }

    try {
      let orderItems: Array<Product & { quantity: number }> = []

      for (const productId in cartItems) {
        if (cartItems[productId] > 0) {
          const product = products.find((p) => p.id === Number(productId))

          if (product) {
            const itemInfo = { ...product, quantity: cartItems[productId] }
            orderItems.push(itemInfo)
          }
        }
      }

      if (orderItems.length === 0) {
        return toast.error('Корзина пуста')
      }

      const orderData = {
        address: {
          name: formData.name,
          email: formData.email,
          street: formData.address,
          phone: formData.phone,
          deliveryTime: formData.deliveryTime,
          comment: formData.comment,
        },
        items: orderItems,
        amount: getCartAmount(),
        paymentMethod: method,
      }

      const response = await axios.post(`${backendUrl}/api/order/place`, orderData, { withCredentials: true })

      if (response.data.success) {
        const orderId = response.data.orderId

        // Если выбрана онлайн-оплата через Stripe
        if (method === 'online' && stripePublishableKey) {
          setIsLoading(true)

          // Создаём Checkout Session
          const paymentResponse = await axios.post(
            `${backendUrl}/api/order/pay`,
            { amount: getCartAmount(), orderId },
            { withCredentials: true }
          )

          if (paymentResponse.data.success) {
            const { sessionId } = paymentResponse.data

            // Загружаем Stripe
            const Stripe = await loadStripeScript()
            const stripe = Stripe(stripePublishableKey) as any

            // Перенаправляем на страницу Stripe Checkout
            const result = await stripe.redirectToCheckout({ sessionId })

            if (result.error) {
              toast.error(result.error.message || 'Ошибка перенаправления на оплату')
              setIsLoading(false)
            }
            // Если успех — Stripe перенаправит на свою страницу оплаты
          } else {
            toast.error(paymentResponse.data.message)
            setIsLoading(false)
          }
        } else {
          // Обычное оформление заказа (без онлайн-оплаты)
          setCartItems({})
          navigate('/orders')
          toast.success('Заказ успешно оформлен!')
        }
      } else {
        toast.error(response.data.message)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка при оформлении заказа')
    }
  }

  return (
    <div className='flex justify-center w-full px-4 md:px-10 my-8'>
      <div className='w-full max-w-5xl bg-white rounded-xl p-6 md:p-8 shadow'>
        <h2 className='text-xl md:text-2xl font-semibold text-gray-800 mb-5'>Оформление заказа</h2>

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-6'>
          {/* ROW 1 */}
          <div className='flex flex-col md:flex-row gap-5'>
            <div className='flex flex-col gap-2 w-full'>
              <label className='text-gray-600'>Имя *</label>
              <input name='name' value={formData.name} onChange={onChangeHandler} required className='w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-300 outline-none' />
            </div>

            <div className='flex flex-col gap-2 w-full'>
              <label className='text-gray-600'>Телефон *</label>
              <input name='phone' value={formData.phone} onChange={onChangeHandler} required className='w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-300 outline-none' />
            </div>
          </div>

          {/* ROW 2 */}
          <div className='flex flex-col md:flex-row gap-5'>
            <div className='flex flex-col gap-2 w-full'>
              <label className='text-gray-600'>Email</label>
              <input name='email' value={formData.email} onChange={onChangeHandler} type='email' className='w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-300 outline-none' />
            </div>

            <div className='flex flex-col gap-2 w-full'>
              <label className='text-gray-600'>Время доставки</label>
              <input name='deliveryTime' value={formData.deliveryTime} onChange={onChangeHandler} placeholder='Например: 14:00-16:00' className='w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-300 outline-none' />
            </div>
          </div>

          {/* ADDRESS */}
          <div className='flex flex-col gap-2'>
            <label className='text-gray-600'>Адрес доставки *</label>
            <input name='address' value={formData.address} onChange={onChangeHandler} required placeholder='Улица, дом, квартира' className='w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-300 outline-none' />
          </div>

          {/* PAYMENT */}
          <div className='flex flex-col gap-2'>
            <label className='text-gray-600'>Способ оплаты *</label>

            <div className='flex flex-wrap gap-6'>
              {['cash', 'card', 'online'].map(item => (
                <label key={item} className='flex items-center gap-2 cursor-pointer'>
                  <input type='radio' checked={method === item} onChange={() => setMethod(item)} disabled={item === 'online' && !stripePublishableKey} />
                  {item === 'cash' && 'Наличными'}
                  {item === 'card' && 'Картой при получении'}
                  {item === 'online' && (stripePublishableKey ? 'Онлайн (карта)' : 'Онлайн (скоро)')}
                </label>
              ))}
            </div>
          </div>

          {/* COMMENT */}
          <div className='flex flex-col gap-2'>
            <label className='text-gray-600'>Комментарий к заказу</label>
            <textarea name='comment' value={formData.comment} onChange={onChangeHandler} className='w-full px-4 py-3 border rounded-lg min-h-[120px] focus:ring-2 focus:ring-red-300 outline-none resize-none' placeholder='Дополнительные пожелания...' />
          </div>

          {/* SUMMARY */}
          <div className='border-t pt-4 text-lg'>
            Итого: <span className='font-semibold text-red-500'>{getCartAmount()} ₽</span>
          </div>

          {/* BUTTON */}
          <button type='submit' disabled={isLoading} className='w-full py-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-400 transition disabled:opacity-50 disabled:cursor-not-allowed'>
            {isLoading ? 'Обработка оплаты...' : 'Оформить заказ'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PlaceOrder
