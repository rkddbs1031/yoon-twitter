import { IYweetsData } from 'types/yweets'
import styles from './yweet.module.scss'

interface IProps {
  yweetObj: IYweetsData
}

const YweetInfo = ({ yweetObj }: IProps) => {
  return (
    <dl>
      <div className={styles.yweetTop}>
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
        <div className={styles.userInfo}>
          {yweetObj.userId && (
            <>
              <dt>아이디</dt>
              <dd className={styles.userId}>{yweetObj.userId}</dd>
            </>
          )}
          <dt>시간</dt>
          <dd className={styles.userDate}>{yweetObj.createdAt}</dd>
        </div>
      </div>
      <div className={styles.yweetBottom}>
        <dt>yweet</dt>
        <dd className={styles.yweetDesc}>{yweetObj.yweet}</dd>
      </div>
    </dl>
  )
}

export default YweetInfo
