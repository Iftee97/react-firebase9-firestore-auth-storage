import React from 'react'
import { useAuthContext } from '../hooks/useAuthContext'

// firebase imports
import { auth } from '../firebaseConfig/firebaseConfig'
import { signOut } from 'firebase/auth'

const Home = () => {
  const { user, dispatch } = useAuthContext()

  const handleLogout = async () => {
    await signOut(auth)
    dispatch({ type: "LOGOUT" }) // dispatch LOGOUT action
  }

  return (
    <div>
      <h1>Home</h1>
      {user && (
        <div>
          <h2>
            Welcome
            <span className="username">{user.displayName}</span>
            <img
              src={user.photoURL}
              alt="user.photoURL"
              className="avatar"
            />
          </h2>
        </div>
      )}
      <button onClick={handleLogout} className="logoutBtn">logout</button>
    </div>
  )
}

export default Home