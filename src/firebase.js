import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// TODO v8のimport v9に全て書き換えたら消す
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDveFeQfWIkNzQ-mzxF95v_Bf6XSM6aA1o",
  authDomain: "original-team-app-c95cb.firebaseapp.com",
  projectId: "original-team-app-c95cb",
  storageBucket: "original-team-app-c95cb.appspot.com",
  messagingSenderId: "942337533252",
  appId: "1:942337533252:web:18c573911723d5631f2311",
  measurementId: "G-F3L17GJWG4",
}

// TODO v8の初期化 v9に全て書き換えたら消す
firebase.initializeApp(firebaseConfig)

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
