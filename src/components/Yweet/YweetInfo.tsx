import { IYweetsData } from 'types/yweets'
import styles from './yweet.module.scss'

interface IProps {
  yweetObj: IYweetsData
}

const YweetInfo = ({ yweetObj }: IProps) => {
  return (
    <dl>
      {yweetObj.imageurl && (
        <div className={styles.userImg}>
          <dt>이미지</dt>
          <dd>
            <div className={styles.imgContainer}>
              <img src={yweetObj.imageurl} alt={yweetObj.yweet} />
            </div>
          </dd>
        </div>
      )}
      <div>
        <dt>yweet</dt>
        <dd className={styles.yweetDesc}>{yweetObj.yweet}</dd>
        {yweetObj.userId && (
          <>
            <dt>아이디</dt>
            <dd className={styles.userId}>{yweetObj.userId}</dd>
          </>
        )}
      </div>
    </dl>
  )
}

export default YweetInfo
