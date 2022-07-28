import { ChangeEvent, FormEvent, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { v4 as uuidv4 } from 'uuid'

import { useState } from 'hooks'
import { userObjstate } from 'states'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { dbService, storageService } from 'utils/firebase'
import { addDoc, collection } from 'firebase/firestore'

import { SubmitIcon } from 'assets/svgs'
import styles from './home.module.scss'
import Loading from 'components/Loading'

const YweetForm = () => {
  const [yweet, setYweet] = useState<string>('')
  const [imageurl, setImageURL] = useState<string>('')
  const fileRef = useRef<HTMLInputElement>(null)
  const userObj = useRecoilValue(userObjstate)
  const [isLoading, setLoading] = useState(false)

  const handleCancleUpload = () => {
    setImageURL('')
    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault()
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
      userId: userObj.displayName,
    }).then(() => {
      setLoading(false)
      setYweet('')
      handleCancleUpload()
    })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setYweet(e.currentTarget.value)

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

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputBox}>
          <input type='text' value={yweet} placeholder="what's on your mind?" maxLength={120} onChange={handleChange} />
          <button type='submit' className={styles.submitBtn}>
            <SubmitIcon />
          </button>
        </div>
        <div className={styles.addImage}>
          <label htmlFor='attachFile'>
            <span>Add photos</span>
            <span>+</span>
          </label>
          <input id='attachFile' type='file' accept='image/*' onChange={onFileChange} ref={fileRef} />
          {imageurl && (
            <div className={styles.photo}>
              <div className={styles.imgWrap}>
                <img src={imageurl} alt='test' />
              </div>
              <button type='button' onClick={handleCancleUpload}>
                삭제
              </button>
            </div>
          )}
        </div>
      </form>
      {isLoading && <Loading />}
    </>
  )
}
export default YweetForm
