<template>
  <div v-if="!shuffleplayersId.includes(playerNum)" class="players-container">
    <h1>PRETENDERは誰？2人選んでね!</h1>
    <div
      v-for="(playerName, playerId) in players"
      :key="playerId"
      v-on:click="votePlayers(playerId)"
      class="players-list"
      :class="{ buttonColor: checkedplayersId.includes(playerId) }"
    >
      {{ playerName }}
    </div>
    <div>
      <button @click="vote" :disabled="voted">投票する</button>
    </div>
  </div>
  <div v-else class="another">みんな投票中だよ！</div>
</template>

<style scoped>
.players-list {
  border: solid;
  border-radius: 1rem;
  width: 200px;
  margin-bottom: 30px;
  margin-top: 30px;
  padding: 10px;
}

.buttonColor {
  background-color: #1704a7;
  color: white;
}

button {
  color: white;
  background-color: #1704a7;
  opacity: 0.8;
  font-weight: bold;
  border-radius: 5px;
  box-shadow: 0px 4px 2px rgb(0, 0, 0);
  padding: 10px 20px;
  cursor: pointer;
}

button:hover {
  opacity: 1;
}

button:active {
  box-shadow: none;
}

.players-container {
  color: #211469;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 50px 200px;
  background-color: white;
  border-radius: 30px;
  border: solid 5px #7767cf;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
}

.another {
  color: #211469;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 50px 200px;
  background-color: white;
  border-radius: 30px;
  border: solid 5px #7767cf;
  white-space: nowrap;
  font-weight: bold;
}
</style>

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
      if (checkedplayersId.value.length === 2) {
        voted.value = true
        const data = {
          votedId: checkedplayersId.value,
          voter: playerNum.value,
        }
        addDoc(collection(db, "rooms", route.params.id, "votes"), data)
      } else {
        alert("2人投票してね！")
      }
    }

    const votePlayers = (playerId) => {
      if (checkedplayersId.value.includes(playerId)) {
        checkedplayersId.value = checkedplayersId.value.filter((elm) => {
          return elm !== playerId
        })
      } else {
        checkedplayersId.value.push(playerId)
      }
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
      votePlayers,
    }
  },
}
</script>
