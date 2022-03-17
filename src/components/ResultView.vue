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
import { onSnapshot, collection } from "firebase/firestore"
import { ref, onUnmounted } from "vue"
import { db } from "@/firebase.js"
import { useRoute } from "vue-router"
import { players, shuffleplayersId } from "@/lib/game.js"
export default {
  setup() {
    const route = useRoute()

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
