import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

// firebase imports
import { auth } from '../firebaseConfig/firebaseConfig'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth"

const Login = () => {
  const { dispatch } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await signInWithEmailAndPassword(auth, email, password)
    console.log("signed in user:", response.user)
    dispatch({ type: "LOGIN", payload: response.user }) // dispatch LOGIN action
  }

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const response = await signInWithPopup(auth, provider)
      console.log("signed in user:", response.user)
      dispatch({ type: "LOGIN", payload: response.user }) // dispatch LOGIN action
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <label>
          email:
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label>
          password:
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>
        <button type='submit'>login</button>
        <p>don't have an account? <Link to="/signup">signup</Link></p>
      </form>

      <div className='oAuthSignUp'>
        <span>or,</span>
        <button onClick={handleGoogleClick}>login with google</button>
      </div>
    </div>
  )
}

export default Login
