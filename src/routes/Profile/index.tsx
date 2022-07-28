import { ChangeEvent, FormEvent } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { userObjstate } from 'states'
import { useEffect, useState } from 'hooks'
import { authService } from 'utils/firebase'
import { updateProfile } from 'firebase/auth'

import styles from './profile.module.scss'

const Profile = () => {
  const user = authService.currentUser
  const userObj = useRecoilValue(userObjstate)
  const [newDisplayName, setNewDisplayName] = useState<string>('')
  const setUserObj = useSetRecoilState(userObjstate)

  const handleRefreshUser = () => user && setUserObj({ uid: user.uid, displayName: user.displayName })

  const handleLogOut = () => authService.signOut()

  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(user!, {
        displayName: newDisplayName,
      })
      handleRefreshUser()
    }
  }

  const handleChangeDisplayName = (e: ChangeEvent<HTMLInputElement>) => setNewDisplayName(e.currentTarget.value)

  useEffect(() => {
    userObj && setNewDisplayName(String(userObj.displayName))
  }, [userObj])

  return (
    <section className={styles.profileContainer}>
      <h2>
        {userObj.displayName ? (
          <>
            <span>{userObj.displayName}</span>님의 프로필
          </>
        ) : (
          <span>아이디를 설정해주세요!</span>
        )}
      </h2>
      <form onSubmit={handleUpdateProfile} className={styles.profileForm}>
        <input
          type='text'
          placeholder='설정할 아이디를 작성해주세요.'
          onChange={handleChangeDisplayName}
          value={newDisplayName}
        />
        <button type='submit'>아이디 업데이트</button>
      </form>
      <button type='button' onClick={handleLogOut} className={styles.logoutBtn}>
        LogOut
      </button>
    </section>
  )
}
export default Profile
