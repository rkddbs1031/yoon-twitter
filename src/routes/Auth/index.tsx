import { MouseEvent } from 'react'
import { getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

import AuthForm from './AuthForm'

const AuthPage = () => {
  const AUTH = getAuth()

  const handleSocialLogin = async (e: MouseEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget
    let provider
    name === 'google' ? (provider = new GoogleAuthProvider()) : (provider = new GithubAuthProvider())
    await signInWithPopup(AUTH, provider)
  }

  return (
    <section>
      <h2>Auth</h2>
      <AuthForm />
      <div>
        <button type='button' name='google' onClick={handleSocialLogin}>
          Continue with Google
        </button>
        <button type='button' name='github' onClick={handleSocialLogin}>
          Continue with GitHub
        </button>
      </div>
    </section>
  )
}
export default AuthPage
