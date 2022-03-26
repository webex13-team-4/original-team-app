<template>
  <div class="players">
    <h1 class="player">プレイヤー一覧</h1>
    <input
      type="text"
      v-model="playerName"
      style="width: 300px; height: 40px"
      placeholder="ニックネーム"
      class="playerinput"
    />
    <div class="playerbtn">
      <button v-on:click="enter(playerName)">この名前で入る。</button>
    </div>
    <div class="text">
      {{ players }}
      <!-- {{ playerNum }} -->
    </div>

    <div>
      <button class="playerbtn2">招待</button>
      <button v-on:click="shuffle" class="playerbtn3">シャッフル</button>
    </div>

    制限時間<input type="number" />分
  </div>
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

<style>
.players {
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 120px 400px;
  background: linear-gradient(#211469, #1704a7);
  border: solid 5px #7767cf;
  border-radius: 30px;
}

.player {
  font-weight: bold;
  white-space: nowrap;
  position: relative;
  top: -40px;
}

.playerbtn button {
  color: blue;
  background-color: white;
  opacity: 0.8;
  font-weight: bold;
  border-radius: 5px;
  box-shadow: 0px 4px 2px rgb(0, 0, 0);
  padding: 10px 20px;
  cursor: pointer;
}

.playerbtn button:hover {
  opacity: 1;
}

.playerbtn button:active {
  box-shadow: none;
  position: relative;
  top: 6px;
}
.playerbtn2 {
  color: blue;
  background-color: white;
  opacity: 0.8;
  font-weight: bold;
  border-radius: 5px;
  box-shadow: 0px 4px 2px rgb(0, 0, 0);
  padding: 10px 20px;
  cursor: pointer;
  margin-right: 10px;
}

.playerbtn2:hover {
  opacity: 1;
}

.playerbtn2:active {
  box-shadow: none;
  position: relative;
  top: 6px;
}
.playerbtn3 {
  color: blue;
  background-color: white;
  opacity: 0.8;
  font-weight: bold;
  border-radius: 5px;
  box-shadow: 0px 4px 2px rgb(0, 0, 0);
  padding: 10px 20px;
  cursor: pointer;
  margin: 0 0 30px 20px;
}

.playerbtn3:hover {
  opacity: 1;
}

.playerbtn3:active {
  box-shadow: none;
  position: relative;
  top: 6px;
}

.playerinput {
  background-color: #1704a7;
  text-align: center;
  font-weight: bold;
  border: solid 2px white;
  border-radius: 10px;
  position: relative;
  top: -20px;
}

.text {
  color: white;
  margin: 50px 0;
  font-size: 20px;
  animation: move-y 0.5s infinite alternate ease-in-out;
  display: inline-block;
}

@keyframes move-y {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(10px);
  }
}
</style>
