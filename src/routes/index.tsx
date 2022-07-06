import { Routes, Route, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'hooks'

import Home from './Home'
import Auth from './Auth'
import Profile from './Profile'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    !isLoggedIn && navigate('auth')
  }, [isLoggedIn, navigate])
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='auth' element={<Auth />} />
      <Route path='profile' element={<Profile />} />
    </Routes>
  )
}
export default App
