import './App.css'
import 'tailwindcss'
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom"
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetails'
import ViewCart from './pages/ViewCart'
import CheckOut from './pages/CheckOut'
import Orders from './pages/Orders'

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/products' element={<ProductCategory />}></Route>
          <Route path='/product_details/:id' element={<ProductDetails />}></Route>
          <Route path='/viewcart' element={<ViewCart />}></Route>
          <Route path='/checkout' element={<CheckOut />}></Route>
          <Route path='/orders' element={<Orders />}></Route>
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App

