import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) => `px-4 py-2 rounded-md transition ${isActive ? 'bg-red-500 text-white' : 'hover:bg-red-100'}`

  return (
    <aside className='w-64 border-r bg-white p-4 flex flex-col gap-2'>
      <NavLink end to='/admin' className={navLinkClass}>
        Dashboard
      </NavLink>
      <NavLink to='/admin/add-category' className={navLinkClass}>
        Категории
      </NavLink>
      <NavLink to='/admin/add' className={navLinkClass}>
        Добавить товар
      </NavLink>
      <NavLink to='/admin/list' className={navLinkClass}>
        Список товаров
      </NavLink>
      <NavLink to='/admin/orders' className={navLinkClass}>
        Заказы
      </NavLink>
    </aside>
  )
}

export default Sidebar
