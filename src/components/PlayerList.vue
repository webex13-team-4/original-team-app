<template>
  <h1>プレイヤー一覧</h1>
  <div>
    <input type="text" v-model="playerName" />
    <button v-on:click="enter(playerName)">この名前で入る。</button>
  </div>
  <div>
    {{ players }}
    {{ playerNum }}
  </div>

  <button>招待</button>
  <!-- <router-link
    :to="`/shufflecheck/${$route.params.id}/${playerNum}`"
    class="navigation__link"
  > -->
  <!-- <router-link
    :to="`/${$route.params.id}/${playerNum}`"
    class="navigation__link"
  > -->
  <div>
    <button v-on:click="shuffle">シャッフル</button>
  </div>
  <!-- </router-link> -->
  <!-- </router-link> -->
  制限時間<input type="number" />分
</template>

<script>
import { onSnapshot, addDoc, collection, setDoc, doc } from "firebase/firestore"
import { ref, onMounted, onUnmounted } from "vue"
import { db } from "@/firebase.js"
// import { useRoute, useRouter } from "vue-router"
import { useRoute } from "vue-router"
import { players, shuffleplayersId } from "@/lib/game.js"
// import { subscribeGameData } from "@/lib/game.js"
export default {
  setup(props, { emit }) {
    // data を置き換える
    const random1 = ref("")
    const random2 = ref("")
    const playerNum = ref(0)
    const route = useRoute()
    // const router = useRouter()

    // methods を置き換える
    const enter = (playerName) => {
      const data = { name: playerName }
      addDoc(collection(db, "rooms", route.params.id, "players"), data)
      players.value.push(playerName)
      playerNum.value = players.value.indexOf(playerName)
      emit("send-playerId", playerNum.value)
    }

    // const shuffleArray = (array, num1, num2) => {
    //   const trash = array[num1]
    //   array[num1] = array[num2]
    //   array[num2] = trash
    //   return array
    // }

    const getRandomInt = (max) => {
      return Math.floor(Math.random() * max)
    }

    const shuffle = () => {
      // const data = { players: players.value }
      // updateDoc(doc(db, "rooms", route.params.id), data)
      random1.value = getRandomInt(players.value.length)
      random2.value = getRandomInt(players.value.length)

      while (random1.value === random2.value) {
        random2.value = getRandomInt(players.value.length)
      }

      // shuffleArray(players.value, random1.value, random2.value)
      // const shuffledata = { shuffleplayers: players.value }
      // updateDoc(doc(db, "rooms", route.params.id, "players"), shuffledata)
      shuffleplayersId.value = [random1.value, random2.value]
      const data = {
        shuffleplayersId: [random1.value, random2.value],
      }
      setDoc(doc(db, "rooms", route.params.id), data)
      emit("change-component", "ShuffleCheck")
    }

    onMounted(() => {
      // const docRef = doc(db, "rooms", route.params.id)
      // getDoc(docRef).then((docSnap) => {
      //   players.value = [...docSnap.data().players]
      // })
      // docRefに変更があったとき、コールバックが実行される
      const Ref = collection(db, "rooms", route.params.id, "players")
      onSnapshot(Ref, (Snapshot) => {
        players.value = []
        Snapshot.forEach((doc) => {
          players.value = [...players.value, doc.data().name]
        })
      })
      // subscribeGameData
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
