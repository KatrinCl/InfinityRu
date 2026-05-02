import { Route, Routes, useLocation } from 'react-router-dom'
import Menu from './pages/Menu'
import Product from './pages/Product'
import Home from './pages/Home'
import Location from './pages/Location'
import Conditions from './pages/Conditions'
import About from './pages/About'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import { ToastContainer } from 'react-toastify'
import { useAppContext } from './context/AppContext'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Footer from './components/Footer'
import AdminLayout from './pages/admin/Layout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminOrders from './pages/admin/Orders'
import AdminAdd from './pages/admin/Add'
import AdminList from './pages/admin/List'
import AdminLogin from './components/admin/AdminLogin'
import Category from './pages/admin/Category'

const App = () => {
  const location = useLocation()
  const { showUserLogin } = useAppContext()

  const isAdminRoute = location.pathname.startsWith('/admin')
  const hideNavbarAndFooter = ['/location'].includes(location.pathname) || isAdminRoute

  return (
    <div>
      {!hideNavbarAndFooter && <Navbar />}
      {!isAdminRoute && showUserLogin ? <Login /> : null}

      <ToastContainer position='top-right' autoClose={3000} />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/location' element={<Location />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/conditions' element={<Conditions />} />
        <Route path='/about' element={<About />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path='add-category' element={<Category />} />
          <Route path='add' element={<AdminAdd />} />
          <Route path='list' element={<AdminList />} />
          <Route path='orders' element={<AdminOrders />} />
        </Route>
      </Routes>

      {!hideNavbarAndFooter && <Footer />}
    </div>
  )
}

export default App
