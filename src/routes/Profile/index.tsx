import { authService } from '../../firebase'

const Profile = () => {
  const handleLogOut = () => authService.signOut()
  return (
    <section>
      <h2>Profile</h2>
      <button type='button' onClick={handleLogOut}>
        LogOut
      </button>
    </section>
  )
}
export default Profile
