<template>
  <h1>プレイヤー一覧</h1>
  <div>
    <input type="text" v-model="playerName" />
    <button v-on:click="enter">この名前で入る。</button>
  </div>

  <div v-if="playerNum === 0">
    <router-link
      :to="`/${$route.params.id}/shufflecheck`"
      class="navigation__link"
    >
      <button v-on:click="shuffle">シャッフル</button>
    </router-link>
    <button v-on:click="copyLink">招待</button>
  </div>

  <div>
    {{ players }}
  </div>
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
    // onMounted(() => {
    //   if (playerNum.value !== 0) {
    //     window.onload = () => {
    //       alert("名前を入力してね！")
    //     }
    //   }
    // })

    const route = useRoute()
    const router = useRouter()
    const copyLink = async () => {
      await navigator.clipboard.writeText(location.href)
      alert("招待リンクをコピーしました!")
    }

    const playerName = ref("")
    const enter = () => {
      players.value.push(playerName.value)
      playerNum.value = players.value.indexOf(playerName.value)
      const data = { name: playerName.value }
      setDoc(
        doc(db, "rooms", route.params.id, "players", `${playerNum.value}`),
        data,
        { merge: true }
      ).then(() => {
        playerName.value = ""
      })
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
      copyLink,
      playerName,
    }
  },
}
</script>
