import { ref } from "vue"
// import { onSnapshot } from "firebase/firestore"

// 共通で使う状態
export const players = ref([])
export const shuffleplayersId = ref([])
// export let unsubscribeGameData

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
