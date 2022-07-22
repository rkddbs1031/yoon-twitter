import { ChangeEvent, FormEvent } from 'react'

import { deleteDoc, updateDoc, doc } from 'firebase/firestore'
import { IYweetsData } from 'types/yweets'
import { dbService } from 'utils/firebase'
import { useState } from 'hooks'

import { EditIcon, DeleteIcon, ModifyIcon, CancleIcon } from 'assets/svgs'
import styles from './yweet.module.scss'

interface IProps {
  yweetObj: IYweetsData
  isOwner: boolean
}

const Yweet = ({ yweetObj, isOwner }: IProps) => {
  const [edditing, setEditing] = useState<boolean>(false)
  const [newYweet, setNewYweet] = useState(yweetObj.yweet)

  const handleDelete = async () => {
    // 임시로 confirm사용하기 추후 모달생성으로 수정
    const ok = window.confirm('정말 삭제하시겠습니까?')
    const NweetTextRef = doc(dbService, 'yweets', yweetObj.id)
    ok && (await deleteDoc(NweetTextRef))
  }

  const handleEdit = () => setEditing((prev) => !prev)

  const handleCancel = () => setEditing((prev) => !prev)

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
          <span>{yweetObj.yweet}</span>
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
