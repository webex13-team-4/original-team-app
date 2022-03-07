import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDveFeQfWIkNzQ-mzxF95v_Bf6XSM6aA1o",
  authDomain: "original-team-app-c95cb.firebaseapp.com",
  projectId: "original-team-app-c95cb",
  storageBucket: "original-team-app-c95cb.appspot.com",
  messagingSenderId: "942337533252",
  appId: "1:942337533252:web:18c573911723d5631f2311",
  measurementId: "G-F3L17GJWG4",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
