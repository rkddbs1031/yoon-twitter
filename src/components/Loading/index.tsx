import styles from './loading.module.scss'

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loading}>
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

export default Loading
