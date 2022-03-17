<template>
  <div v-if="!shuffleplayersId.includes(playerNum)">
    誰と誰が入れ替わっている？
    <div v-for="(playerName, playerId) in players" :key="playerId">
      <input type="checkbox" :value="playerId" v-model="checkedplayersId" />
      <label>{{ playerName }}</label>
    </div>
    <div>
      <button @click="vote">投票する</button>
    </div>
  </div>

  <div v-else>みんな投票中だよ！</div>
  <router-link :to="`/${$route.params.id}/resultview`" class="navigation__link">
    <button v-on:click="exitvote">終了</button>
  </router-link>
</template>

<script>
import { doc, collection, addDoc, updateDoc } from "firebase/firestore"
import { ref } from "vue"
import { db } from "@/firebase.js"
import { useRoute } from "vue-router"
import { players, shuffleplayersId, playerNum } from "@/lib/game.js"
export default {
  setup() {
    const route = useRoute()

    const checkedplayersId = ref([])

    const vote = () => {
      const data = {
        votedId: checkedplayersId.value,
        voter: playerNum.value,
      }
      addDoc(collection(db, "rooms", route.params.id, "votes"), data)
    }

    const exitvote = () => {
      const compodata = { currentComponent: "resultview" }
      updateDoc(doc(db, "rooms", route.params.id), compodata)
    }

    return {
      vote,
      checkedplayersId,
      exitvote,
      players,
      shuffleplayersId,
      playerNum,
    }
  },
}
</script>
