import { FormEvent, ChangeEvent } from 'react'
import { useState, useEffect } from 'hooks'
import { dbService } from 'utils/firebase'
import { addDoc, collection, orderBy, query, onSnapshot } from 'firebase/firestore'

interface IYweetsData {
  id: string
  createdAt?: number
  yweet?: string
}

const Home = () => {
  const [yweet, setYweet] = useState<string>('')
  const [yweets, setYweets] = useState<IYweetsData[]>([])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await addDoc(collection(dbService, 'yweets'), {
      yweet,
      createdAt: Date.now(),
    })
    setYweet('')
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    setYweet(value)
  }

  const getYweets = async () => {
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
