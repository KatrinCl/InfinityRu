import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { getImageSrc } from '../../utils/imageSrc'

type Product = {
  id: number
  name: string
  price: number
  category: string
  image: string[] | string
  popular: boolean
}

const List = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string

  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [removingId, setRemovingId] = useState<number | null>(null)

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/product/list`, {
        withCredentials: true,
      })

      if (data?.success && Array.isArray(data.products)) {
        setProducts(data.products as Product[])
      } else {
        toast.error(data?.message || 'Не удалось загрузить товары')
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Ошибка загрузки товаров')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendUrl])

  const getPreviewImage = (img: Product['image']) => {
    if (Array.isArray(img)) return img[0]
    return img
  }

  const popularLabel = useMemo(() => {
    return (v: boolean) => (v ? 'Популярный' : 'Обычный')
  }, [])

  const removeProduct = async (id: number) => {
    if (!confirm('Удалить товар?')) return

    setRemovingId(id)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { withCredentials: true },
      )

      if (data?.success) {
        toast.success('Товар удалён')
        await fetchProducts()
      } else {
        toast.error(data?.message || 'Не удалось удалить товар')
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Ошибка удаления товара')
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <section className='flex flex-col gap-4'>
      <h1 className='text-2xl font-semibold'>Список товаров</h1>

      {isLoading ? (
        <div className='bg-white border rounded-lg p-4 text-gray-600'>Загрузка...</div>
      ) : (
        <div className='bg-white border rounded-lg p-4 text-gray-600 flex flex-col gap-4'>
          {products.length === 0 ? (
            <div>Товаров пока нет.</div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full text-sm'>
                <thead>
                  <tr className='text-left'>
                    <th className='p-2'>Товар</th>
                    <th className='p-2'>Категория</th>
                    <th className='p-2'>Цена</th>
                    <th className='p-2'>Популярный</th>
                    <th className='p-2'>Изображение</th>
                    <th className='p-2'>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className='border-t'>
                      <td className='p-2 font-medium text-gray-800'>
                        <div className='flex items-center gap-3'>
                          <span>#{String(p.id).padStart(6, '0')}</span>
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td className='p-2'>{p.category}</td>
                      <td className='p-2'>{p.price} ₽</td>
                      <td className='p-2'>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${p.popular ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                          {popularLabel(p.popular)}
                        </span>
                      </td>
                      <td className='p-2'>
                        <img
                          src={getImageSrc(backendUrl, getPreviewImage(p.image))}
                          className='w-12 h-12 object-cover rounded-md'
                        />
                      </td>
                      <td className='p-2'>
                        <button
                          onClick={() => void removeProduct(p.id)}
                          disabled={removingId === p.id}
                          className='px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50 cursor-pointer'
                        >
                          {removingId === p.id ? 'Удаление...' : 'Удалить'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default List