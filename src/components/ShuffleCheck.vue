<template>
  {{ text }}

  <div v-if="playerNum === 0">
    <button v-on:click="enterChat">チャットを開始する。</button>
  </div>

  <div v-if="playerNum === 0">
    制限時間<input type="number" v-model="time" />分
  </div>
</template>

<script>
import { doc, updateDoc, onSnapshot } from "firebase/firestore"
import { ref, onUnmounted } from "vue"
import { db } from "@/firebase.js"
import { useRoute } from "vue-router"
import { players, shuffleplayersId, playerNum } from "@/lib/game.js"
export default {
  setup() {
    const route = useRoute()
    const text = ref("")
    const time = ref("")

    const shuffleref = doc(db, "rooms", route.params.id)
    const shuffleunsub = onSnapshot(shuffleref, async (Snapshot) => {
      shuffleplayersId.value = []
      shuffleplayersId.value = await Snapshot.data().shuffleplayersId
      if (shuffleplayersId.value[0] === playerNum.value) {
        text.value = `あなたはシャッフルされています。
     ${players.value[shuffleplayersId.value[1]]}
   になりすましてください。`
      } else if (shuffleplayersId.value[1] === playerNum.value) {
        text.value = `あなたはシャッフルされています。
     ${players.value[shuffleplayersId.value[0]]}
   になりすましてください。`
      } else {
        text.value = "あなたはシャッフルされていません！"
      }
    })

    const enterChat = () => {
      const compodata = { currentComponent: "chatview" }
      updateDoc(doc(db, "rooms", route.params.id), compodata)
      const timedata = { time: time.value * 60, sec: "", min: "" }
      updateDoc(doc(db, "rooms", route.params.id), timedata)
    }

    onUnmounted(() => {
      shuffleunsub()
    })
    return {
      text,
      enterChat,
      shuffleplayersId,
      playerNum,
      time,
    }
  },
}
</script>
