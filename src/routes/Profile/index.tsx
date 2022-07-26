import { ChangeEvent, FormEvent } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { userObjstate } from 'states'
import { IYweetsData } from 'types/yweets'
import { useEffect, useState, useCallback } from 'hooks'
import { dbService, authService } from 'utils/firebase'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'

import styles from './profile.module.scss'

const Profile = () => {
  const user = authService.currentUser
  const userObj = useRecoilValue(userObjstate)
  const [myYweets, setMyYweets] = useState<IYweetsData[]>([])
  const [newDisplayName, setNewDisplayName] = useState(String(userObj.displayName))
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

  const getMyYweets = useCallback(async () => {
    const yweets = await getDocs(
      query(collection(dbService, 'yweets'), where('creatorId', '==', userObj.uid), orderBy('createdAt', 'desc'))
    )
    yweets.forEach((doc) => {
      const yweetObj = {
        id: doc.id,
        ...doc.data(),
      }
      myYweets !== null && setMyYweets((prev) => [yweetObj, ...prev])
    })
  }, [myYweets, userObj.uid])

  useEffect(() => {
    getMyYweets()
  }, [getMyYweets])

  return (
    <section className={styles.profileContainer}>
      <h2>
        <span>{userObj.displayName}님</span>의 Profile
      </h2>
      <form onSubmit={handleUpdateProfile} className={styles.profileForm}>
        <input
          type='text'
          placeholder='수정할 아이디를 작성해주세요.'
          onChange={handleChangeDisplayName}
          value={newDisplayName}
        />
        <button type='submit'>프로필 업데이트</button>
      </form>
      <button type='button' onClick={handleLogOut} className={styles.logoutBtn}>
        LogOut
      </button>
    </section>
  )
}
export default Profile
