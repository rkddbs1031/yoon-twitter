import { MouseEvent } from 'react'
import { getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

import AuthForm from './AuthForm'
import { TweetIcon, GoogleIcon, GithubIcon } from 'assets/svgs'

import styles from './auth.module.scss'

const AuthPage = () => {
  const AUTH = getAuth()

  const handleSocialLogin = async (e: MouseEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget
    let provider
    name === 'google' ? (provider = new GoogleAuthProvider()) : (provider = new GithubAuthProvider())
    await signInWithPopup(AUTH, provider)
  }

  return (
    <section className={styles.authContainer}>
      <div>
        <h2>
          <TweetIcon />
        </h2>
        <AuthForm />
        <div className={styles.socialBtns}>
          <button type='button' name='google' onClick={handleSocialLogin}>
            Continue with Google <GoogleIcon />
          </button>
          <button type='button' name='github' onClick={handleSocialLogin}>
            Continue with GitHub <GithubIcon />
          </button>
        </div>
      </div>
    </section>
  )
}
export default AuthPage
