import { Routes, Route, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'hooks'
import { authService } from '../firebase'

import Home from './Home'
import Auth from './Auth'
import Profile from './Profile'
import Footer from 'components/Footer'
import Header from 'components/Header'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      user ? setIsLoggedIn(true) : setIsLoggedIn(false)
    })
  }, [])

  useEffect(() => {
    if (!isLoggedIn) navigate('auth')
  }, [isLoggedIn, navigate])

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='auth' element={<Auth />} />
        <Route path='profile' element={<Profile />} />
      </Routes>
      <Footer />
    </>
  )
}
export default App
