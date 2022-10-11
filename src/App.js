import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

// pages and components
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'

const App = () => {
  const { authIsReady, user } = useAuthContext()

  return (
    <div className='app'>
      {authIsReady && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  )
}

export default App