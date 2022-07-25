import { FormEvent, ChangeEvent, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { v4 as uuidv4 } from 'uuid'

import { useState, useEffect } from 'hooks'
import { userObjstate } from 'states'
import { IYweetsData } from 'types/yweets'
import { dbService, storageService } from 'utils/firebase'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, orderBy, query, onSnapshot } from 'firebase/firestore'

import Yweet from 'components/Yweet'
import { SubmitIcon } from 'assets/svgs'
import styles from './home.module.scss'

const Home = () => {
  const [yweet, setYweet] = useState<string>('')
  const [yweets, setYweets] = useState<IYweetsData[]>([])
  const [imageurl, setImageURL] = useState<string>('')
  const userObj = useRecoilValue(userObjstate)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // 사진먼저 업로드하기
    let getFileURL = ''
    const storageRef = ref(storageService, `${userObj.uid}/${uuidv4()}`)
    if (imageurl) {
      const res = await uploadString(storageRef, imageurl, 'data_url')
      getFileURL = await getDownloadURL(res.ref)
    }
    await addDoc(collection(dbService, 'yweets'), {
      yweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      imageurl: getFileURL,
    }).then(() => {
      setYweet('')
      handleCancleUpload()
    })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setYweet(e.currentTarget.value)

  const getYweets = async () => {
    await onSnapshot(query(collection(dbService, 'yweets'), orderBy('createdAt', 'desc')), (snapshot) => {
      const yweetsObj = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setYweets(yweetsObj)
    })
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget
    if (files) {
      const uploadFile = files[0]
      const reader = new FileReader()
      reader.onload = (finishedEvent) => {
        setImageURL(finishedEvent.target?.result as string)
      }
      reader.readAsDataURL(uploadFile)
    }
  }

  const handleCancleUpload = () => {
    setImageURL('')
    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

  useEffect(() => {
    getYweets()
  }, [])

  return (
    <section>
      <h2>Home</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputBox}>
          <input type='text' value={yweet} placeholder="what's on your mind?" maxLength={120} onChange={handleChange} />
          <input type='file' accept='image/*' onChange={onFileChange} ref={fileRef} />
          {imageurl && (
            <>
              <div className={styles.imgWrap}>
                <img src={imageurl} alt='test' />
              </div>
              <button type='button' onClick={handleCancleUpload}>
                삭제
              </button>
            </>
          )}
          <button type='submit' className={styles.submitBtn}>
            <SubmitIcon />
          </button>
        </div>
      </form>
      <ul className={styles.yweetList}>
        {yweets.map((item) => (
          <Yweet key={item.id} yweetObj={item} isOwner={item.creatorId === userObj.uid} />
        ))}
      </ul>
    </section>
  )
}
export default Home
