<template>
  {{ text }}
  <div>
    <router-link
      :to="`/${$route.params.id}/${$route.params.playerId}/chatview`"
      class="navigation__link"
    >
      <button v-on:click="enterChat">チャットに参加する。</button>
    </router-link>
  </div>
</template>

<script>
import { doc, onSnapshot, collection, updateDoc } from "firebase/firestore"
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
      if (shuffleplayersId.value.length === 2) {
        if (shuffleplayersId.value[0] == route.params.playerId) {
          text.value = `あなたはシャッフルされています。
     ${players.value[shuffleplayersId.value[1]]}
   になりすましてください。`
        } else if (shuffleplayersId.value[1] == route.params.playerId) {
          text.value = `あなたはシャッフルされています。
     ${players.value[shuffleplayersId.value[0]]}
   になりすましてください。`
        } else {
          text.value = "あなたはシャッフルされていません！"
        }
      }
    })

    const text = ref("")
    const enterChat = () => {
      const compodata = { currentComponent: "chatview" }
      updateDoc(doc(db, "rooms", route.params.id), compodata)
    }

    onUnmounted(() => {
      playerunsub()
      componentunsub()
      shuffleunsub()
    })
    return {
      text,
      enterChat,
    }
  },
}
</script>
