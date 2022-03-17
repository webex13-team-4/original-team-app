<template>
  {{ irekawari }}が参加しました。
  <div>
    <input type="text" />
  </div>

  <div>
    <router-link
      :to="`/${$route.params.id}/${$route.params.playerId}/voteview`"
      class="navigation__link"
    >
      <button v-on:click="exitChat">チャット終了</button>
    </router-link>
  </div>
</template>

<script>
import { doc, collection, onSnapshot, updateDoc } from "firebase/firestore"
import { ref, onUnmounted } from "vue"
import { db } from "@/firebase.js"
import { useRoute, useRouter } from "vue-router"
import { players, shuffleplayersId } from "@/lib/game.js"
export default {
  props: {
    players: [],
  },

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
      console.log("a")
      router.replace(
        `/${route.params.id}/${route.params.playerId}/${
          Snapshot.data().currentComponent
        }`
      )
    })

    const irekawari = ref("")

    const shuffleref = doc(db, "rooms", route.params.id)
    const shuffleunsub = onSnapshot(shuffleref, (Snapshot) => {
      shuffleplayersId.value = []
      shuffleplayersId.value = Snapshot.data().shuffleplayersId
      if (shuffleplayersId.value[0] == route.params.playerId) {
        irekawari.value = players.value[shuffleplayersId.value[1]]
      } else if (shuffleplayersId.value[1] == route.params.playerId) {
        irekawari.value = players.value[shuffleplayersId.value[0]]
      } else {
        irekawari.value = players.value[route.params.playerId]
      }
    })

    const exitChat = () => {
      const compodata = { currentComponent: "voteview" }
      updateDoc(doc(db, "rooms", route.params.id), compodata)
    }
    onUnmounted(() => {
      playerunsub()
      componentunsub()
      shuffleunsub()
    })
    return {
      irekawari,
      exitChat,
    }
  },
}
</script>
