<template>
  <div class="players">
    <h1>プレイヤー一覧</h1>

    <div class="text">
      <div v-for="(player, index) in players" :key="index" class="players-list">
        {{ player }}
      </div>
    </div>

    <div v-if="playerNum === 0">
      <router-link
        :to="`/${$route.params.id}/shufflecheck`"
        class="navigation__link"
      >
        <button v-on:click="shuffle" class="btn" :disabled="players.length < 3">
          シャッフル
        </button>
      </router-link>
      <button v-on:click="copyLink" class="btn2">招待</button>
    </div>

    <div v-else>
      <input
        type="text"
        v-model="playerName"
        placeholder="ニックネーム"
        style="width: 300px; height: 30px"
        class="playerinput"
      />
      <button v-on:click="enter" :disabled="checked" class="btn3">
        この名前で入る
      </button>
    </div>
  </div>
</template>

<script>
import { doc, updateDoc, setDoc } from "firebase/firestore"
import { ref } from "vue"
import { db } from "@/firebase.js"
import { players, getRandomInt, playerNum } from "@/lib/game.js"
import { useRoute, useRouter } from "vue-router"

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const copyLink = async () => {
      await navigator.clipboard.writeText(location.href)
      alert("招待リンクをコピーしました!")
    }
    const checked = ref(false)
    const playerName = ref("")
    const enter = () => {
      checked.value = true
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
    const random3 = ref(0)
    const shuffle = () => {
      random1.value = getRandomInt(players.value.length)
      random2.value = getRandomInt(players.value.length)
      while (random1.value === random2.value) {
        random2.value = getRandomInt(players.value.length)
      }
      random3.value = getRandomInt(players.value.length)
      while (
        random3.value === random1.value ||
        random3.value === random2.value
      ) {
        random3.value = getRandomInt(players.value.length)
      }
      const compodata = { currentComponent: "shufflecheck" }
      updateDoc(doc(db, "rooms", route.params.id), compodata)

      const data = {
        shuffleplayersId: [random1.value, random2.value],
        madmanId: random3.value,
      }
      updateDoc(doc(db, "rooms", route.params.id), data)
    }

    return {
      enter,
      shuffle,
      playerNum,
      players,
      copyLink,
      playerName,
      checked,
    }
  },
}
</script>

<style scoped>
h1 {
  white-space: nowrap;
  position: relative;
  top: -70px;
  text-shadow: 0 1px #bbb, 0 2px #aaa, 0 3px #999, 0 4px #888, 0 5px #777,
    0 6px #666, 0 7px #555, 0 8px #444, 0 9px #333, 0 10px 8px #000;
}
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

.btn {
  color: blue;
  background-color: white;
  opacity: 0.8;
  font-weight: bold;
  border-radius: 5px;
  box-shadow: 0px 4px 2px rgb(0, 0, 0);
  padding: 10px 20px;
  margin-right: 30px;
  cursor: pointer;
}

.btn:hover {
  opacity: 1;
}

.btn:active {
  box-shadow: none;
  position: relative;
  top: 6px;
}
.btn2 {
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

.btn2:hover {
  opacity: 1;
}

.btn2:active {
  box-shadow: none;
  position: relative;
  top: 6px;
}
.btn3 {
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

.btn3:hover {
  opacity: 1;
}

.btn3:active {
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
  position: relative;
  top: -50px;
}

@keyframes move-y {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(10px);
  }
}

input,
textarea {
  color: white;
}

.players-list {
  border: solid;
  border-radius: 1rem;
  width: 200px;
  margin-bottom: 30px;
  margin-top: 30px;
  padding: 10px;
}
</style>
