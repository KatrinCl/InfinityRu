import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

type Category = {
  id: number
  name: string
}

const Category = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string

  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [removingId, setRemovingId] = useState<number | null>(null)

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/product/list-categories`, {
        withCredentials: true,
      })

      if (data?.success && Array.isArray(data.categories)) {
        setCategories(data.categories as Category[])
      } else {
        toast.error(data?.message || 'Не удалось загрузить категории')
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Ошибка загрузки категорий')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendUrl])

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Введите название категории')
      return
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/product/add-category`, { name }, {
        withCredentials: true,
      })

      if (data.success) {
        toast.success('Категория добавлена')
        setName('')
        await fetchCategories()
      } else {
        toast.error(data?.message || 'Не удалось добавить категорию')
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Ошибка добавления категории')
    }
  }

  const removeCategory = async (id: number) => {
    if (!confirm('Удалить категорию?')) return

    setRemovingId(id)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/product/remove-category`,
        { id },
        { withCredentials: true },
      )

      if (data?.success) {
        toast.success('Категория удалена')
        await fetchCategories()
      } else {
        toast.error(data?.message || 'Не удалось удалить категорию')
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Ошибка удаления категории')
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <section className='flex flex-col gap-4'>
      <h1 className='text-2xl font-semibold'>Категории</h1>

      <form onSubmit={submitHandler} className='bg-white border rounded-lg p-4 flex flex-col md:flex-row gap-4 items-end'>
        <label className='flex-1 flex flex-col gap-2'>
          Название категории
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Введите название'
            className='border rounded-md px-3 py-2'
          />
        </label>

        <button className='px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition whitespace-nowrap'>
          Добавить категорию
        </button>
      </form>

      {isLoading ? (
        <div className='bg-white border rounded-lg p-4 text-gray-600'>Загрузка...</div>
      ) : (
        <div className='bg-white border rounded-lg p-4 text-gray-600 flex flex-col gap-4'>
          {categories.length === 0 ? (
            <div>Категорий пока нет.</div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full text-sm'>
                <thead>
                  <tr className='text-left'>
                    <th className='p-2'>ID</th>
                    <th className='p-2'>Название</th>
                    <th className='p-2'>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className='border-t'>
                      <td className='p-2 font-medium text-gray-800'>#{String(cat.id).padStart(6, '0')}</td>
                      <td className='p-2'>{cat.name}</td>
                      <td className='p-2'>
                        <button
                          onClick={() => void removeCategory(cat.id)}
                          disabled={removingId === cat.id}
                          className='px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50'
                        >
                          {removingId === cat.id ? 'Удаление...' : 'Удалить'}
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

export default Category
