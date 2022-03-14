<template>
  <h1>プレイヤー一覧</h1>
  <div>
    <input type="text" v-model="playerName" />
    <button v-on:click="enter(playerName)">この名前で入る。</button>
  </div>
  <div>
    {{ players }}
    <!-- {{ playerNum }} -->
  </div>

  <button>招待</button>

  <div>
    <button v-on:click="shuffle">シャッフル</button>
  </div>

  制限時間<input type="number" />分
</template>

<script>
import { onSnapshot, addDoc, collection, setDoc, doc } from "firebase/firestore"
import { ref, onMounted, onUnmounted } from "vue"
import { db } from "@/firebase.js"
import { useRoute } from "vue-router"
import { players, shuffleplayersId } from "@/lib/game.js"
export default {
  setup(props, { emit }) {
    const random1 = ref("")
    const random2 = ref("")
    const playerNum = ref(0)
    const route = useRoute()
    const enter = (playerName) => {
      const data = { name: playerName }
      addDoc(collection(db, "rooms", route.params.id, "players"), data)
      players.value.push(playerName)
      playerNum.value = players.value.indexOf(playerName)
      emit("send-playerId", playerNum.value)
    }

    const getRandomInt = (max) => {
      return Math.floor(Math.random() * max)
    }

    const shuffle = () => {
      random1.value = getRandomInt(players.value.length)
      random2.value = getRandomInt(players.value.length)

      while (random1.value === random2.value) {
        random2.value = getRandomInt(players.value.length)
      }

      shuffleplayersId.value = [random1.value, random2.value]
      const data = {
        shuffleplayersId: [random1.value, random2.value],
      }
      setDoc(doc(db, "rooms", route.params.id), data)
      emit("change-component", "ShuffleCheck")
    }

    onMounted(() => {
      const Ref = collection(db, "rooms", route.params.id, "players")
      onSnapshot(Ref, (Snapshot) => {
        players.value = []
        Snapshot.forEach((doc) => {
          players.value = [...players.value, doc.data().name]
        })
      })
    })

    onUnmounted(() => {
      const Ref = collection(db, "rooms", route.params.id, "players")
      const unsubscribe = onSnapshot(Ref, (Snapshot) => {
        players.value = []
        Snapshot.forEach((doc) => {
          players.value = [...players.value, doc.data().name]
        })
      })
      unsubscribe()
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
