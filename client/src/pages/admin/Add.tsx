import { useEffect, useState, type FormEvent } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

type FormState = {
  name: string
  composition: string
  weight: string
  weight1: string
  weight2: string
  price: string
  category: string
  popular: boolean
}

const Add = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string

  const [form, setForm] = useState<FormState>({
    name: '',
    composition: '',
    weight: '',
    weight1: '',
    weight2: '',
    price: '',
    category: '',
    popular: false,
  })

  const [categories, setCategories] = useState([])
  const imageKeys = ['image1', 'image2', 'image3', 'image4'] as const
  const [images, setImages] = useState<Record<(typeof imageKeys)[number], File | null>>({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  })

  const setImage = (key: keyof typeof images, file: File | null) => {
    setImages(prev => ({ ...prev, [key]: file }))
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const required = ['name', 'composition', 'weight', 'weight1', 'weight2', 'price', 'category'] as const
    for (const key of required) {
      if (!form[key].trim()) {
        toast.error('Заполните обязательные поля формы')
        return
      }
    }

    const hasAtLeastOneImage = Object.values(images).some(Boolean)
    if (!hasAtLeastOneImage) {
      toast.error('Загрузите хотя бы одно изображение')
      return
    }

    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('composition', form.composition)
    fd.append('weight', form.weight)
    fd.append('weight1', form.weight1)
    fd.append('weight2', form.weight2)
    fd.append('price', form.price)
    fd.append('category', form.category)
    fd.append('popular', form.popular ? 'true' : 'false')

    if (images.image1) fd.append('image1', images.image1)
    if (images.image2) fd.append('image2', images.image2)
    if (images.image3) fd.append('image3', images.image3)
    if (images.image4) fd.append('image4', images.image4)

    try {
      const { data } = await axios.post(`${backendUrl}/api/product/add`, fd, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (data?.success) {
        toast.success('Товар добавлен')
        setForm({
          name: '',
          composition: '',
          weight: '',
          weight1: '',
          weight2: '',
          price: '',
          category: '',
          popular: false,
        })
        setImages({ image1: null, image2: null, image3: null, image4: null })
      } else {
        toast.error(data?.message || 'Не удалось добавить товар')
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Ошибка добавления товара')
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get(`${backendUrl}/api/product/list-categories`)

      if (data.success) {
        setCategories(data.categories)
      }
    }

    fetchCategories()
  }, [])

  return (
    <section className='flex flex-col gap-4'>
      <h1 className='text-2xl font-semibold'>Добавить товар</h1>

      <form onSubmit={onSubmit} className='bg-white border rounded-lg p-4 text-gray-700 flex flex-col gap-4'>
        <div className='flex flex-col md:flex-row gap-4'>
          <label className='flex flex-col gap-2 flex-1'>
            Название
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className='border rounded-md px-3 py-2' required />
          </label>
          <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className='border rounded-md px-3 py-2' required>
            <option value=''>Выберите категорию</option>

            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <label className='flex flex-col gap-2'>
          Описание (состав)
          <textarea value={form.composition} onChange={e => setForm(p => ({ ...p, composition: e.target.value }))} className='border rounded-md px-3 py-2 min-h-[100px]' required />
        </label>

        <div className='flex flex-col md:flex-row gap-4'>
          <label className='flex flex-col gap-2 flex-1'>
            Вес (г)
            <input type='number' value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))} className='border rounded-md px-3 py-2' required />
          </label>
          <label className='flex flex-col gap-2 flex-1'>
            Пищевая ценность 100г
            <input type='number' value={form.weight1} onChange={e => setForm(p => ({ ...p, weight1: e.target.value }))} className='border rounded-md px-3 py-2' required />
          </label>
          <label className='flex flex-col gap-2 flex-1'>
            Пищевая ценность порция
            <input type='number' value={form.weight2} onChange={e => setForm(p => ({ ...p, weight2: e.target.value }))} className='border rounded-md px-3 py-2' required />
          </label>
        </div>

        <div className='flex flex-col md:flex-row gap-4'>
          <label className='flex flex-col gap-2 flex-1'>
            Цена (₽)
            <input type='number' step='0.01' value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className='border rounded-md px-3 py-2' required />
          </label>

          <label className='flex items-center gap-3 rounded-md border px-3 py-2 flex-1 bg-gray-50'>
            <input type='checkbox' checked={form.popular} onChange={e => setForm(p => ({ ...p, popular: e.target.checked }))} />
            Популярный
          </label>
        </div>

        <div className='flex flex-col gap-2'>
          <div className='text-sm font-medium text-gray-600'>Изображения (минимум 1)</div>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3'>
            {imageKeys.map(key => (
              <label key={key} className='flex flex-col gap-2 border rounded-lg p-3 bg-gray-50'>
                <span className='text-sm text-gray-600'>{key}</span>
                <input type='file' accept='image/*' onChange={e => setImage(key, e.target.files?.[0] ?? null)} />
              </label>
            ))}
          </div>
        </div>

        <div className='flex items-center gap-3'>
        <button type='submit' className='px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition cursor-pointer'>
            Добавить товар
          </button>
        </div>
      </form>
    </section>
  )
}

export default Add
