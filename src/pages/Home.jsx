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
      {user && <h2>Welcome {user.displayName}</h2>}
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default Home