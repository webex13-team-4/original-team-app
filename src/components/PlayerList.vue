<template>
  <h1>プレイヤー一覧</h1>
  <div>
    <input type="text" v-model="playerName" />
    <button v-on:click="enter(playerName)">この名前で入る。</button>
  </div>
  <div>
    {{ players }}
  </div>

  <button>招待</button>

  <div v-if="playerNum === 0">
    <router-link
      :to="`/${$route.params.id}/shufflecheck`"
      class="navigation__link"
    >
      <button v-on:click="shuffle">シャッフル</button>
    </router-link>
  </div>

  制限時間<input type="number" />分
</template>

<script>
import { doc, updateDoc, setDoc } from "firebase/firestore"
import { ref } from "vue"
import { db } from "@/firebase.js"
import {
  players,
  shuffleplayersId,
  getRandomInt,
  playerNum,
} from "@/lib/game.js"
import { useRoute, useRouter } from "vue-router"

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()

    const enter = (playerName) => {
      players.value.push(playerName)
      playerNum.value = players.value.indexOf(playerName)
      const data = { name: playerName }
      setDoc(
        doc(db, "rooms", route.params.id, "players", `${playerNum.value}`),
        data,
        { merge: true }
      )
      router.push(`/${route.params.id}/playerlist`)
    }

    const random1 = ref(0)
    const random2 = ref(0)
    const shuffle = () => {
      random1.value = getRandomInt(players.value.length)
      random2.value = getRandomInt(players.value.length)
      while (random1.value === random2.value) {
        random2.value = getRandomInt(players.value.length)
      }
      const compodata = { currentComponent: "shufflecheck" }
      updateDoc(doc(db, "rooms", route.params.id), compodata)

      const data = {
        shuffleplayersId: [random1.value, random2.value],
      }
      updateDoc(doc(db, "rooms", route.params.id), data)
    }

    return {
      enter,
      shuffle,
      playerNum,
      players,
      shuffleplayersId,
    }
  },
}
</script>
