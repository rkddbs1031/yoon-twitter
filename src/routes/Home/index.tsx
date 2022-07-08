import { FormEvent, ChangeEvent } from 'react'
import { useRecoilValue } from 'recoil'

import { useState, useEffect } from 'hooks'
import { userObjstate } from 'states'
import { IYweetsData } from 'types/yweets'
import { dbService } from 'utils/firebase'
import { addDoc, collection, orderBy, query, onSnapshot } from 'firebase/firestore'

const Home = () => {
  const [yweet, setYweet] = useState<string>('')
  const [yweets, setYweets] = useState<IYweetsData[]>([])
  const userObj = useRecoilValue(userObjstate)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await addDoc(collection(dbService, 'yweets'), {
      yweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    })
    setYweet('')
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    setYweet(value)
  }

  const getYweets = async () => {
    // onSnapshot은 realtime~~
    await onSnapshot(query(collection(dbService, 'yweets'), orderBy('createdAt', 'desc')), (snapshot) => {
      const yweetsObj = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setYweets(yweetsObj)
    })
  }

  useEffect(() => {
    getYweets()
  }, [])

  return (
    <section>
      <h2>Home</h2>
      <form onSubmit={handleSubmit}>
        <input type='text' value={yweet} placeholder="what's on your mind?" maxLength={120} onChange={handleChange} />
        <button type='submit'>Yweet</button>
      </form>
      <ul>
        {yweets.map((item) => (
          <li key={item.id}>{item.yweet}</li>
        ))}
      </ul>
    </section>
  )
}
export default Home
