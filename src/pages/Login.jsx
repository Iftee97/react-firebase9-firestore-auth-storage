import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

// firebase imports
import { auth } from '../firebaseConfig/firebaseConfig'
import { signInWithEmailAndPassword } from "firebase/auth"

const Login = () => {
  const { dispatch } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await signInWithEmailAndPassword(auth, email, password)
    dispatch({ type: "LOGIN", payload: response.user }) // dispatch LOGIN action
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
    </div>
  )
}

export default Login
