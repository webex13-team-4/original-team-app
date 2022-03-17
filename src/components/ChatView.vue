<template>
  {{ irekawari }}が参加しました。
  <div>
    <input type="text" />
  </div>

  <div>
    <router-link :to="`/${$route.params.id}/voteview`" class="navigation__link">
      <button v-on:click="exitChat">チャット終了</button>
    </router-link>
  </div>
</template>

<script>
import { doc, updateDoc } from "firebase/firestore"
import { ref } from "vue"
import { db } from "@/firebase.js"
import { useRoute } from "vue-router"
import { players, shuffleplayersId, playerNum } from "@/lib/game.js"
export default {
  setup() {
    const route = useRoute()

    const irekawari = ref("")

    if (shuffleplayersId.value[0] === playerNum.value) {
      irekawari.value = players.value[shuffleplayersId.value[1]]
    } else if (shuffleplayersId.value[1] === playerNum.value) {
      irekawari.value = players.value[shuffleplayersId.value[0]]
    } else {
      irekawari.value = players.value[playerNum.value]
    }

    const exitChat = () => {
      const compodata = { currentComponent: "voteview" }
      updateDoc(doc(db, "rooms", route.params.id), compodata)
    }
    return {
      irekawari,
      exitChat,
      shuffleplayersId,
    }
  },
}
</script>
