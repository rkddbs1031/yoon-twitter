import { Routes, Route, useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'

import { useState, useEffect } from 'hooks'
import { authService } from 'utils/firebase'
import { userObjstate } from 'states'
import { IUserInfo } from 'types/yweets'

import Home from './Home'
import Auth from './Auth'
import Profile from './Profile'
import Footer from 'components/Footer'
import Header from 'components/Header'
import Loading from 'components/Loading'

const App = () => {
  const [ready, setReady] = useState<boolean>(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const setUserObj = useSetRecoilState<IUserInfo>(userObjstate)
  const navigate = useNavigate()

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true)
        setUserObj({
          uid: user.uid,
          displayName: user.displayName,
        })
      } else {
        setIsLoggedIn(false)
        setUserObj({
          uid: null,
          displayName: null,
        })
      }
      setReady(true)
    })
  }, [setUserObj])

  useEffect(() => {
    if (!isLoggedIn && ready) navigate('auth')
  }, [isLoggedIn, navigate, ready])

  if (!ready) return <Loading />

  // if (init && )
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
