import { ChangeEvent, FormEvent } from 'react'

import { useState } from 'hooks'
import { IYweetsData } from 'types/yweets'
import { dbService, storageService } from 'utils/firebase'
import { deleteDoc, updateDoc, doc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'

import YweetInfo from './YweetInfo'
import styles from './yweet.module.scss'
import { EditIcon, DeleteIcon, ModifyIcon, CancleIcon } from 'assets/svgs'

interface IProps {
  yweetObj: IYweetsData
  isOwner: boolean
}

const Yweet = ({ yweetObj, isOwner }: IProps) => {
  const [edditing, setEditing] = useState<boolean>(false)
  const [newYweet, setNewYweet] = useState(yweetObj.yweet)

  const handleEdit = () => setEditing((prev) => !prev)

  const handleCancel = () => setEditing((prev) => !prev)

  const handleDelete = async () => {
    const ok = window.confirm('정말 삭제하시겠습니까?')
    const NweetTextRef = doc(dbService, 'yweets', yweetObj.id)
    if (ok) {
      await deleteDoc(NweetTextRef)
      yweetObj.imageurl && (await deleteObject(ref(storageService, yweetObj.imageurl)))
    }
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const NweetTextRef = doc(dbService, 'yweets', yweetObj.id)
    await updateDoc(NweetTextRef, {
      yweet: newYweet,
    })
    setEditing(false)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    setNewYweet(value)
  }

  return (
    <li className={styles.yweet}>
      {edditing ? (
        <form onSubmit={onSubmit}>
          <div className={styles.formWrap}>
            <div className={styles.inputBox}>
              <input type='text' value={newYweet} placeholder='Edut your yweet' onChange={handleChange} />
            </div>
            <div className={styles.btnWrap}>
              <button type='button' onClick={handleCancel}>
                <CancleIcon />
              </button>
              <button type='submit'>
                <ModifyIcon />
              </button>
            </div>
          </div>
        </form>
      ) : (
        <>
          <YweetInfo yweetObj={yweetObj} />
          {isOwner && (
            <div className={styles.btnWrap}>
              <button type='button' onClick={handleEdit}>
                <EditIcon />
              </button>
              <button type='button' onClick={handleDelete}>
                <DeleteIcon />
              </button>
            </div>
          )}
        </>
      )}
    </li>
  )
}
export default Yweet
