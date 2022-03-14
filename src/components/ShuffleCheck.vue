<template>
  {{ text }}
  <div>
    <button v-on:click="enterChat">チャットに参加する。</button>
  </div>
  <!-- {{ players }}
  {{ shuffleplayersId }}
  {{ playerId }} -->
</template>

<script>
import { getDoc, doc } from "firebase/firestore"
import { ref, onMounted } from "vue"
import { db } from "@/firebase.js"
import { useRoute } from "vue-router"
export default {
  props: {
    players: [],
  },
  setup(props, { emit }) {
    const text = ref("")
    const shuffleplayersId = ref([])
    const route = useRoute()
    const enterChat = () => {
      emit("change-component", "ChatView")
    }
    onMounted(() => {
      getDoc(doc(db, "rooms", route.params.id)).then((Snapshot) => {
        shuffleplayersId.value = []
        shuffleplayersId.value = Snapshot.data().shuffleplayersId
        if (shuffleplayersId.value.length === 2) {
          if (shuffleplayersId.value[0] == route.params.playerId) {
            text.value = `あなたはシャッフルされています。
     ${props.players[shuffleplayersId.value[1]]}
   になりすましてください。`
          } else if (shuffleplayersId.value[1] == route.params.playerId) {
            text.value = `あなたはシャッフルされています。
     ${props.players[shuffleplayersId.value[0]]}
   になりすましてください。`
          } else {
            text.value = "あなたはシャッフルされていません！"
          }
        }
      })
    })
    return {
      text,
      enterChat,
      shuffleplayersId,
    }
  },
}
</script>
