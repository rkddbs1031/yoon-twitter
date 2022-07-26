import { NavLink } from 'react-router-dom'
import { NAVI_ITEM } from 'utils/navigation'
import { cx } from 'styles'
import styles from './header.module.scss'

const Header = () => {
  return (
    <header className={styles.header}>
      <ul>
        {NAVI_ITEM.map((item) => (
          <li key={item.id}>
            <NavLink to={item.href} className={({ isActive }) => cx({ [styles.isActive]: isActive })}>
              <item.svg />
              <span>{item.text}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </header>
  )
}
export default Header
