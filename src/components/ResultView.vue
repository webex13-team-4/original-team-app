<template>
  <h1>結果発表</h1>
  <div>1位{{ votedId }}</div>
  <div>
    実は・・{{ players[shuffleplayersId[0]] }}と{{
      players[shuffleplayersId[1]]
    }}が入れ替わってました!
  </div>
</template>

<script>
import { onSnapshot, collection, doc } from "firebase/firestore"
import { ref, onUnmounted } from "vue"
import { db } from "@/firebase.js"
import { useRoute, useRouter } from "vue-router"
import { players, shuffleplayersId } from "@/lib/game.js"
export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const Ref = collection(db, "rooms", route.params.id, "players")
    const playerunsub = onSnapshot(Ref, (Snapshot) => {
      players.value = []
      Snapshot.forEach((doc) => {
        players.value = [...players.value, doc.data().name]
      })
    })

    const docref = doc(db, "rooms", route.params.id)
    const componentunsub = onSnapshot(docref, (Snapshot) => {
      router.replace(
        `/${route.params.id}/${route.params.playerId}/${
          Snapshot.data().currentComponent
        }`
      )
    })
    const shuffleref = doc(db, "rooms", route.params.id)
    const shuffleunsub = onSnapshot(shuffleref, (Snapshot) => {
      shuffleplayersId.value = []
      shuffleplayersId.value = Snapshot.data().shuffleplayersId
    })

    const votedId = ref([])
    const voteRef = collection(db, "rooms", route.params.id, "votes")
    const voteunsub = onSnapshot(voteRef, (Snapshot) => {
      votedId.value = []
      Snapshot.forEach((doc) => {
        let temp = doc.data().votedId
        if (temp[0] > temp[1]) {
          let trash = temp[0]
          temp[0] = temp[1]
          temp[1] = trash
        }
        votedId.value = [...votedId.value, temp]
      })
    })

    onUnmounted(() => {
      playerunsub()
      componentunsub()
      shuffleunsub()
      voteunsub()
    })
    return {
      shuffleplayersId,
      votedId,
      players,
    }
  },
}
</script>
