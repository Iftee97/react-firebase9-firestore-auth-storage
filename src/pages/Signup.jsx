import React, { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'

// firebase imports
import { db, auth, storage } from '../firebaseConfig/firebaseConfig'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { collection, addDoc } from "firebase/firestore"

const Signup = () => {
  const { dispatch } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [thumbnail, setThumbnail] = useState(null)

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
        console.log('Upload is ' + progress + '% done')
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
      </form>
    </div>
  )
}

export default Signup