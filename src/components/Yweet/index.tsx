import { ChangeEvent, FormEvent } from 'react'
import { deleteDoc, updateDoc, doc } from 'firebase/firestore'
import { IYweetsData } from 'types/yweets'
import { dbService } from 'utils/firebase'
import { useState } from 'hooks'

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

  return edditing ? (
    <form onSubmit={onSubmit}>
      <input type='text' value={newYweet} placeholder='Edut your yweet' onChange={handleChange} />
      <button type='button' onClick={handleCancel}>
        Cancel
      </button>
      <button type='submit'>Update</button>
    </form>
  ) : (
    <li>
      <span>{yweetObj.yweet}</span>
      {isOwner && (
        <>
          <button type='button' onClick={handleDelete}>
            Delete
          </button>
          <button type='button' onClick={handleEdit}>
            Edit
          </button>
        </>
      )}
    </li>
  )
}
export default Yweet
