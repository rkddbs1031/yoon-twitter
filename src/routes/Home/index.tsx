import { useRecoilValue } from 'recoil'
import { useState, useEffect } from 'hooks'
import { userObjstate } from 'states'
import { IYweetsData } from 'types/yweets'
import { dbService } from 'utils/firebase'
import { collection, orderBy, query, onSnapshot } from 'firebase/firestore'

import YweetForm from './YweetForm'
import Yweet from 'components/Yweet'
import styles from './home.module.scss'

const Home = () => {
  const [yweets, setYweets] = useState<IYweetsData[]>([])
  const userObj = useRecoilValue(userObjstate)

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
    userObj.uid && getYweets()
  }, [userObj])

  return (
    <section>
      <h2 className={styles.irSu}>Home</h2>
      <YweetForm />
      {yweets.length > 0 && (
        <ul className={styles.yweetList}>
          {yweets.map((item) => (
            <Yweet key={item.id} yweetObj={item} isOwner={item.creatorId === userObj.uid} />
          ))}
        </ul>
      )}
    </section>
  )
}
export default Home
