import styles from './footer.module.scss'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <h2>&copy;{new Date().getFullYear()} YWitter</h2>
    </footer>
  )
}
export default Footer
