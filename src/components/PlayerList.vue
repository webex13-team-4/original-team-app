<template>
  <h1>プレイヤー一覧</h1>

  <div>
    {{ players }}
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

  <div v-else>
    <input type="text" v-model="playerName" />
    <button v-on:click="enter" :disabled="checked">この名前で入る。</button>
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
      checked,
    }
  },
}
</script>

<style scoped>
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
