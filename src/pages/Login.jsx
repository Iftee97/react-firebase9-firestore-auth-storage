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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await signInWithEmailAndPassword(auth, email, password)
      console.log("signed in user:", response.user)
      dispatch({ type: "LOGIN", payload: response.user }) // dispatch LOGIN action
    } catch (err) {
      console.log(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleClick = async () => {
    try {
      setLoading(true)
      const googleAuthProvider = new GoogleAuthProvider()
      const response = await signInWithPopup(auth, googleAuthProvider)
      console.log("signed in user:", response.user)
      dispatch({ type: "LOGIN", payload: response.user }) // dispatch LOGIN action
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
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
        {!loading && <button type='submit'>login</button>}
        {loading && <button disabled>loading...</button>}
        {error && <p>{error}</p>}
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
