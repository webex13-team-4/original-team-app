<template>
  {{ text }}

  <div v-if="playerNum === 0">
    <router-link :to="`/${$route.params.id}/chatview`" class="navigation__link">
      <button v-on:click="enterChat">チャットを開始する。</button>
    </router-link>
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
import { players, shuffleplayersId, playerNum, time } from "@/lib/game.js"
export default {
  setup() {
    const route = useRoute()
    console.log(playerNum.value)
    const text = ref("")

    const shuffleref = doc(db, "rooms", route.params.id)
    const shuffleunsub = onSnapshot(shuffleref, (Snapshot) => {
      shuffleplayersId.value = []
      shuffleplayersId.value = Snapshot.data().shuffleplayersId
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
