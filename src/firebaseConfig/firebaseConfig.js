import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBAkSvUEFzntAyRn2cnqdSgYmh08qITD6g",
  authDomain: "react-firebase9-42987.firebaseapp.com",
  projectId: "react-firebase9-42987",
  storageBucket: "react-firebase9-42987.appspot.com",
  messagingSenderId: "155909695053",
  appId: "1:155909695053:web:467d6f2bb78753543a9e04"
}

// initialize firebase
initializeApp(firebaseConfig)

// initialise firestore database
const db = getFirestore()

// initialise authentication
const auth = getAuth()

// initialise storage
const storage = getStorage()

export {
  db,
  auth,
  storage
}