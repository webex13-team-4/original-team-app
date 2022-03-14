<template>
  <div v-if="!shuffle">
    誰と誰が入れ替わっている？
    <div v-for="(playerName, playerId) in players" :key="playerId">
      <input type="checkbox" :value="playerId" v-model="checkedplayersId" />
      <label>{{ playerName }}</label>
    </div>
  </div>

  <div v-else>みんな投票中だよ！</div>
  <button v-on:click="exitvote">終了</button>
  {{ checkedplayersId }}

  <div>
    <button @click="vote">投票する</button>
  </div>
</template>

<script>
import { getDoc, doc, collection, addDoc } from "firebase/firestore"
import { ref, onMounted } from "vue"
import { db } from "@/firebase.js"
import { useRoute } from "vue-router"
// import { players, shuffleplayersId } from "@/lib/game.js"
export default {
  props: {
    players: [],
  },

  setup(props, { emit }) {
    const shuffle = ref("")
    const route = useRoute()
    const checkedplayersId = ref([])
    const shuffleplayersId = ref([])

    const vote = () => {
      const data = {
        votedId: checkedplayersId.value,
        voter: route.params.playerId,
      }
      addDoc(collection(db, "rooms", route.params.id, "votes"), data)
    }

    const exitvote = () => {
      emit("change-component", "ResultView")
    }

    onMounted(() => {
      getDoc(doc(db, "rooms", route.params.id)).then((Snapshot) => {
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
    })
    return {
      shuffle,
      vote,
      checkedplayersId,
      exitvote,
    }
  },
}
</script>
