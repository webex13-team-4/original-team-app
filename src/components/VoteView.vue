<template>
  <div v-if="!shuffle">
    誰と誰が入れ替わっている？
    <div v-for="(playerName, playerId) in players" :key="playerId">
      <input type="checkbox" :value="playerId" v-model="checkedplayersId" />
      <label>{{ playerName }}</label>
    </div>
    <div>
      <button @click="vote">投票する</button>
    </div>
    <!-- {{ checkedplayersId }} -->
  </div>

  <div v-else>みんな投票中だよ！</div>
  <router-link
    :to="`/${$route.params.id}/${$route.params.playerId}/resultview`"
    class="navigation__link"
  >
    <button v-on:click="exitvote">終了</button>
  </router-link>
</template>

<script>
import {
  doc,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore"
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
      console.log(players.value)
    })

    const docref = doc(db, "rooms", route.params.id)
    const componentunsub = onSnapshot(docref, (Snapshot) => {
      router.replace(
        `/${route.params.id}/${route.params.playerId}/${
          Snapshot.data().currentComponent
        }`
      )
    })

    const shuffle = ref("")

    const shuffleref = doc(db, "rooms", route.params.id)
    const shuffleunsub = onSnapshot(shuffleref, (Snapshot) => {
      shuffleplayersId.value = []
      shuffleplayersId.value = Snapshot.data().shuffleplayersId
      if (shuffleplayersId.value[0] == route.params.playerId) {
        shuffle.value = true
      } else if (shuffleplayersId.value[1] == route.params.playerId) {
        shuffle.value = true
      } else {
        shuffle.value = false
      }
    })

    const checkedplayersId = ref([])

    const vote = () => {
      const data = {
        votedId: checkedplayersId.value,
        voter: route.params.playerId,
      }
      addDoc(collection(db, "rooms", route.params.id, "votes"), data)
    }

    const exitvote = () => {
      const compodata = { currentComponent: "resultview" }
      updateDoc(doc(db, "rooms", route.params.id), compodata)
    }

    onUnmounted(() => {
      playerunsub()
      componentunsub()
      shuffleunsub()
    })
    return {
      shuffle,
      vote,
      checkedplayersId,
      exitvote,
      players,
    }
  },
}
</script>
