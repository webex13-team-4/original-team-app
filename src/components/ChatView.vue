<template>
  {{ irekawari }}が参加しました。
  <div>
    <input type="text" />
  </div>

  <div>
    <button v-on:click="exitChat">チャット終了</button>
  </div>
</template>

<script>
import { getDoc, doc } from "firebase/firestore"
import { ref, onMounted } from "vue"
import { db } from "@/firebase.js"
import { useRoute } from "vue-router"
// import { players, shuffleplayersId } from "@/lib/game.js"
export default {
  props: {
    players: [],
  },

  setup(props, { emit }) {
    const irekawari = ref("")
    const shuffleplayersId = ref([])
    const route = useRoute()
    const exitChat = () => {
      emit("change-component", "VoteView")
    }
    onMounted(() => {
      getDoc(doc(db, "rooms", route.params.id)).then((Snapshot) => {
        shuffleplayersId.value = []
        shuffleplayersId.value = Snapshot.data().shuffleplayersId
        console.log(shuffleplayersId.value)
        if (shuffleplayersId.value[0] == route.params.playerId) {
          irekawari.value = props.players[shuffleplayersId.value[1]]
        } else if (shuffleplayersId.value[1] == route.params.playerId) {
          irekawari.value = props.players[shuffleplayersId.value[0]]
        } else {
          irekawari.value = props.players[route.params.playerId]
        }
      })
    })
    return {
      irekawari,
      exitChat,
    }
  },
}
</script>
