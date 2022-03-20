import { ref } from "vue"
import { onSnapshot, doc, collection } from "firebase/firestore"
import { db } from "@/firebase.js"
import { useRoute, useRouter } from "vue-router"

export const playerNum = ref("")

export const componentSubscribe = () => {
  // console.log("通信を開始します...!")
  const route = useRoute()
  const router = useRouter()
  const Ref = doc(db, "rooms", route.params.id)
  return onSnapshot(Ref, (Snapshot) => {
    router.push(`/${route.params.id}/${Snapshot.data().currentComponent}`)
  })
}

export const players = ref([])
export const playersSubscribe = () => {
  const route = useRoute()
  const Ref = collection(db, "rooms", route.params.id, "players")
  return onSnapshot(Ref, (Snapshot) => {
    players.value = []
    Snapshot.forEach((doc) => {
      players.value = [...players.value, doc.data().name]
    })
  })
}

export const votes = ref([])
export const shuffleplayersId = ref([])

export const getRandomInt = (max) => {
  return Math.floor(Math.random() * max)
}
