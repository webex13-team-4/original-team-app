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

  <div>
    <router-link
      :to="`/${$route.params.id}/${playerNum}/shufflecheck`"
      class="navigation__link"
    >
      <button v-on:click="shuffle">シャッフル</button>
    </router-link>
  </div>

  制限時間<input type="number" />分
</template>

<script>
import {
  onSnapshot,
  collection,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore"
import { ref, onUnmounted } from "vue"
import { db } from "@/firebase.js"
import { players, shuffleplayersId, getRandomInt } from "@/lib/game.js"
import { useRoute, useRouter } from "vue-router"

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
    })

    const docref = doc(db, "rooms", route.params.id)
    const componentunsub = onSnapshot(docref, (Snapshot) => {
      router.replace(
        `/${route.params.id}/${route.params.playerId}/${
          Snapshot.data().currentComponent
        }`
      )
    })

    const random1 = ref("")
    const random2 = ref("")
    const playerNum = ref(0)
    const enter = (playerName) => {
      players.value.push(playerName)
      playerNum.value = players.value.indexOf(playerName)
      const data = { name: playerName }
      setDoc(
        doc(db, "rooms", route.params.id, "players", `${playerNum.value}`),
        data,
        { merge: true }
      )
      router.replace(`/${route.params.id}/${playerNum.value}/playerlist`)
    }

    const shuffle = () => {
      const compodata = { currentComponent: "shufflecheck" }
      updateDoc(doc(db, "rooms", route.params.id), compodata)
      random1.value = getRandomInt(players.value.length)
      random2.value = getRandomInt(players.value.length)

      while (random1.value === random2.value) {
        random2.value = getRandomInt(players.value.length)
      }

      shuffleplayersId.value = [random1.value, random2.value]
      const data = {
        shuffleplayersId: [random1.value, random2.value],
      }
      updateDoc(doc(db, "rooms", route.params.id), data)
    }

    onUnmounted(() => {
      playerunsub()
      componentunsub()
    })
    return {
      enter,
      shuffle,
      playerNum,
      players,
    }
  },
}
</script>
