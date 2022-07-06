import { FormEvent, ChangeEvent, MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'hooks'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

const AUTH = getAuth()

const AuthPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [newAccount, setNewAccount] = useState<boolean>(true)
  const [authError, setAuthError] = useState<string>('')

  const handleSocialClick = async (e: MouseEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget
    let provider

    if (name === 'google') {
      provider = new GoogleAuthProvider()
    } else {
      provider = new GithubAuthProvider()
    }
    await signInWithPopup(AUTH, provider)
  }

  const toggleAccount = () => setNewAccount((prev) => !prev)

  const handleAccount = async () => {
    let data

    if (newAccount) {
      try {
        data = await createUserWithEmailAndPassword(AUTH, email, password)
      } catch (err) {
        if ((err as { message: string }).message.includes('auth/email-already-in-use')) {
          setAuthError('해당 계정으로 이미 가입이 되어있습니다.')
        } else if ((err as { message: string }).message.includes('auth/weak-password')) {
          setAuthError('비밀번호는 최소 6자리 입니다.')
        }
      }
    } else {
      try {
        data = await signInWithEmailAndPassword(AUTH, email, password)
      } catch (err) {
        const errMsg = 'auth/wrong-password'
        if ((err as { message: string }).message.includes(errMsg)) setAuthError('비밀번호가 맞지 않습니다.')
      }
    }
    data && navigate('/')
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleAccount()
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    if (name === 'email') setEmail(value)
    else setPassword(value)
  }

  return (
    <section>
      <h2>Auth</h2>
      <form onSubmit={onSubmit}>
        <input name='email' type='email' placeholder='Email' required onChange={onChange} />
        <input name='password' type='password' placeholder='Password' required onChange={onChange} />
        <span>{authError}</span>
        <button type='submit'>{newAccount ? 'Create Account' : 'Sign In'}</button>
      </form>
      <button type='button' onClick={toggleAccount}>
        {newAccount ? 'Sign In' : 'Create Account'}
      </button>
      <div>
        <button type='button' name='google' onClick={handleSocialClick}>
          Continue with Google
        </button>
        <button type='button' name='github' onClick={handleSocialClick}>
          Continue with GitHub
        </button>
      </div>
    </section>
  )
}
export default AuthPage
