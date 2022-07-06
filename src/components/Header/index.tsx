import { NavLink } from 'react-router-dom'
import { NAVI_ITEM } from 'utils/navigation'

const Header = () => {
  return (
    <header>
      <ul>
        {NAVI_ITEM.map((item) => (
          <li key={item.id}>
            <NavLink to={item.href}>{item.text}</NavLink>
          </li>
        ))}
      </ul>
    </header>
  )
}
export default Header
