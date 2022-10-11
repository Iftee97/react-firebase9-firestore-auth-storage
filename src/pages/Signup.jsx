import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

// firebase imports
import {
  db,
  auth,
  storage
} from '../firebaseConfig/firebaseConfig'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth"
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage"
import {
  collection,
  addDoc,
  getDoc,
  doc
} from "firebase/firestore"


const Signup = () => {
  const { dispatch } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // sign up user
    const response = await createUserWithEmailAndPassword(auth, email, password)
    console.log(response)

    // create a unique image name
    const date = new Date().getTime()
    const storageRef = ref(storage, `${displayName + date}`)

    // upload image to firebase storage
    const uploadTask = uploadBytesResumable(storageRef, thumbnail)
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is' + progress + '% done')
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused')
            break

          case 'running':
            console.log('Upload is running')
            break

          default:
            break
        }
      },
      (error) => {
        console.log(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(
          async (downloadURL) => {
            await addDoc(collection(db, "users"), {
              email,
              displayName,
              photoURL: downloadURL,
              uid: response.user.uid
            }) // adding user info to firestore database in "users" collection

            await updateProfile(response.user, {
              displayName,
              photoURL: downloadURL
            }) // updating user profile with displayName and photoURL

            dispatch({ type: "LOGIN", payload: response.user }) // dispatch LOGIN action
          }
        )
      }
    )
  }

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const response = await signInWithPopup(auth, provider)
      const user = response.user
      console.log(`signed up user:`, user)

      // Check for user in firestore db
      const docSnapshot = await getDoc(doc(db, 'users', user.uid))

      // if user doesn't exist, add user to firestore db (basically sign up the user)
      if (!docSnapshot.exists()) {
        await addDoc(collection(db, "users"), {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        })
      }

      await updateProfile(response.user, {
        displayName: user.displayName,
        photoURL: user.photoURL,
      }) // updating user profile with displayName and photoURL

      dispatch({ type: "LOGIN", payload: response.user }) // dispatch LOGIN action

      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <label>
          username:
          <input
            type="text"
            onChange={(e) => setDisplayName(e.target.value)}
            value={displayName}
          />
        </label>
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
        <label>
          Profile Thumbnail:
          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
        </label>
        <button type='submit'>signup</button>
        <p>already have an account? <Link to="/login">login</Link></p>
      </form>

      <div className='oAuthSignUp'>
        <span>or,</span>
        <button onClick={handleGoogleClick}>signup with google</button>
      </div>
    </div>
  )
}

export default Signup