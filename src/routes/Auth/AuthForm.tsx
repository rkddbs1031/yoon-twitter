import { FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { useState } from 'hooks'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

import styles from './auth.module.scss'

const AuthForm = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [newAccount, setNewAccount] = useState<boolean>(true)
  const [authError, setAuthError] = useState<string>('')
  const AUTH = getAuth()

  const toggleAccount = () => setNewAccount((prev) => !prev)

  const handleAddNewAccount = async () => {
    try {
      const data = await createUserWithEmailAndPassword(AUTH, email, password)
      data && navigate('/')
    } catch (err) {
      if ((err as { message: string }).message.includes('auth/email-already-in-use')) {
        setAuthError('해당 계정으로 이미 가입이 되어있습니다.')
      } else if ((err as { message: string }).message.includes('auth/weak-password')) {
        setAuthError('비밀번호는 최소 6자리 입니다.')
      }
    }
  }

  const handleLoginAccount = async () => {
    try {
      const data = await signInWithEmailAndPassword(AUTH, email, password)
      data && navigate('/')
    } catch (err) {
      const errMsg = 'auth/wrong-password'
      if ((err as { message: string }).message.includes(errMsg)) setAuthError('비밀번호가 맞지 않습니다.')
    }
  }

  const handleNewAccount = async () => {
    if (newAccount) {
      handleAddNewAccount()
    } else {
      handleLoginAccount()
    }
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleNewAccount()
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    if (name === 'email') setEmail(value)
    else setPassword(value)
  }

  return (
    <form onSubmit={onSubmit} className={styles.authForm}>
      <input name='email' type='email' placeholder='Email' required onChange={onChange} />
      <input name='password' type='password' placeholder='Password' required onChange={onChange} />
      {authError && <p className={styles.authError}>{authError}</p>}
      <button type='submit' className={styles.submitBtn}>
        {newAccount ? 'Create Account' : 'Sign In'}
      </button>
      <button type='button' onClick={toggleAccount} className={styles.btn}>
        {newAccount ? 'Sign In' : 'Create Account'}
      </button>
    </form>
  )
}
export default AuthForm
