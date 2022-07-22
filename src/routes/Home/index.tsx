import { FormEvent, ChangeEvent, useRef } from 'react'
import { useRecoilValue } from 'recoil'

import { useState, useEffect } from 'hooks'
import { userObjstate } from 'states'
import { IYweetsData } from 'types/yweets'
import { dbService } from 'utils/firebase'
import { addDoc, collection, orderBy, query, onSnapshot } from 'firebase/firestore'

import Yweet from 'components/Yweet'
import { SubmitIcon } from 'assets/svgs'
import styles from './home.module.scss'

const Home = () => {
  const [yweet, setYweet] = useState<string>('')
  const [yweets, setYweets] = useState<IYweetsData[]>([])
  const [fileURL, setFileURL] = useState<string>()
  const userObj = useRecoilValue(userObjstate)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await addDoc(collection(dbService, 'yweets'), {
      yweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    }).then(() => {
      setYweet('')
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
        setFileURL(finishedEvent.target?.result as string)
      }
      reader.readAsDataURL(uploadFile)
    }
  }

  const handleCancleUpload = () => {
    setFileURL('')
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
          {fileURL && (
            <>
              <div className={styles.imgWrap}>
                <img src={fileURL} alt='test' />
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
