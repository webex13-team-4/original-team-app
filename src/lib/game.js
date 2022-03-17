import { ref } from "vue"
// import { onSnapshot } from "firebase/firestore"
import { onSnapshot, doc } from "firebase/firestore"
import { db } from "@/firebase.js"
import { useRoute, useRouter } from "vue-router"
// 共通で使う状態
export const players = ref([])
export const shuffleplayersId = ref([])
export const docId = ref("")
const router = useRouter()
const route = useRoute()

// export const subscribeGameData = () => {
//   // subscribeする
//   // playersとか更新する
//   const unsubscribe = onSnapshot((docSnap) => {
//     const data = docSnap.data()
//     console.log(data)
//     if (data.players && data.players.length !== players.value.length) {
//       players.value = data.players
//     }
//   })
//   unsubscribeGameData = unsubscribe
// }

// firebaseで参加しているプレイヤーのリストを取得して、リアルタイムに反映する

export const componentSubscribe = () => {
  const Ref = doc(db, "rooms", route.params.id)
  const unsubscribe = onSnapshot(Ref, (Snapshot) => {
    router.replace(
      `/${route.params.id}/${route.params.playerId}/${
        Snapshot.data().currentComponent
      }`
    )
  })
  return {
    unsubscribe,
  }
}

export const getRandomInt = (max) => {
  return Math.floor(Math.random() * max)
}
