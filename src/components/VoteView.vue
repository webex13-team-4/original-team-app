<template>
  <div v-if="!shuffleplayersId.includes(playerNum)">
    誰と誰が入れ替わっている？
    <div v-for="(playerName, playerId) in players" :key="playerId">
      <input type="checkbox" :value="playerId" v-model="checkedplayersId" />
      <label>{{ playerName }}</label>
    </div>
    <div>
      <button @click="vote" :disabled="voted">投票する</button>
    </div>
  </div>

  <div v-else>みんな投票中だよ！</div>
  <!-- <router-link :to="`/${$route.params.id}/resultview`" class="navigation__link">
    <button v-on:click="exitvote">終了</button>
  </router-link> -->
</template>

<script>
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore"
import { ref, onUnmounted } from "vue"
import { db } from "@/firebase.js"
import { useRoute, useRouter } from "vue-router"
import { players, shuffleplayersId, playerNum, votedIds } from "@/lib/game.js"
export default {
  setup() {
    const route = useRoute()
    const router = useRouter()

    const checkedplayersId = ref([])

    // 投票をリアルタイムで更新
    const Ref = collection(db, "rooms", route.params.id, "votes")
    const votesUnsubscribe = onSnapshot(Ref, (Snapshot) => {
      votedIds.value = []
      Snapshot.forEach((doc) => {
        let temp = doc.data().votedId
        if (temp[0] > temp[1]) {
          let trash = temp[0]
          temp[0] = temp[1]
          temp[1] = trash
        }
        votedIds.value = [...votedIds.value, temp]
      })
      if (votedIds.value.length === players.value.length - 2) {
        router.push(`/${route.params.id}/resultview`)
        const compodata = { currentComponent: "resultview" }
        updateDoc(doc(db, "rooms", route.params.id), compodata)
      }
    })

    // 投票機能
    const voted = ref(false)

    const vote = () => {
      voted.value = true
      const data = {
        votedId: checkedplayersId.value,
        voter: playerNum.value,
      }
      addDoc(collection(db, "rooms", route.params.id, "votes"), data)
    }
    onUnmounted(() => {
      votesUnsubscribe()
    })

    return {
      vote,
      checkedplayersId,
      players,
      shuffleplayersId,
      playerNum,
      votedIds,
      voted,
    }
  },
}
</script>
