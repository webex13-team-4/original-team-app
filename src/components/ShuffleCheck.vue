<template>
  <div class="shuffle">
    <div class="chattext">
      {{ text }}
    </div>
    <div v-if="playerNum === 0">
      <button v-on:click="enterChat" class="chatbtn">
        チャットを開始する。
      </button>
    </div>

    <div v-if="playerNum === 0">
      <span>制限時間</span><input type="number" v-model="time" /><span>分</span>
    </div>
  </div>
</template>

<script>
import { doc, updateDoc, onSnapshot } from "firebase/firestore"
import { ref, onUnmounted } from "vue"
import { db } from "@/firebase.js"
import { useRoute } from "vue-router"
import { players, shuffleplayersId, playerNum } from "@/lib/game.js"
export default {
  setup() {
    const route = useRoute()
    const text = ref("")
    const time = ref("")

    const shuffleref = doc(db, "rooms", route.params.id)
    const shuffleunsub = onSnapshot(shuffleref, async (Snapshot) => {
      shuffleplayersId.value = []
      shuffleplayersId.value = await Snapshot.data().shuffleplayersId
      if (shuffleplayersId.value[0] === playerNum.value) {
        text.value = `あなたはシャッフルされています。
     ${players.value[shuffleplayersId.value[1]]}
   になりすましてください。`
      } else if (shuffleplayersId.value[1] === playerNum.value) {
        text.value = `あなたはシャッフルされています。
     ${players.value[shuffleplayersId.value[0]]}
   になりすましてください。`
      } else {
        text.value = "あなたはシャッフルされていません！"
      }
    })

    const enterChat = () => {
      const compodata = { currentComponent: "chatview" }
      updateDoc(doc(db, "rooms", route.params.id), compodata)
      const timedata = { time: time.value * 60, sec: "", min: "" }
      updateDoc(doc(db, "rooms", route.params.id), timedata)
    }

    onUnmounted(() => {
      shuffleunsub()
    })

    return {
      text,
      enterChat,
      shuffleplayersId,
      playerNum,
      time,
    }
  },
}
</script>

<style scoped>
.shuffle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 200px 150px;
  background-color: white;
  border-radius: 30px;
  border: solid 5px #7767cf;
}

.chattext {
  color: #211469;
  white-space: nowrap;
  opacity: 0; /* ここを追加 */
  font-weight: bold;
  font-size: 30px;
  position: relative;
  top: -50px;
  animation-name: fadeIn;
  animation-delay: 0.5s;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

.chatbtn {
  color: white;
  background-color: #1704a7;
  opacity: 0.8;
  font-weight: bold;
  border-radius: 5px;
  box-shadow: 0px 4px 2px rgb(0, 0, 0);
  padding: 10px 20px;
  cursor: pointer;
  margin: 0 0 30px 20px;
  opacity: 0; /* ここを追加 */
  animation-delay: 1.5s;
  animation-duration: 1.5s;
  animation-name: fadeIn; /* アニメーション名 */
  animation-fill-mode: forwards; /*これで値を保持*/
}
@keyframes fadeIn {
  /*animation-nameで設定した値を書く*/
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chatbtn:hover {
  opacity: 1;
}

.chatbtn:active {
  box-shadow: none;
  position: relative;
  top: 6px;
}

span {
  font-weight: bold;
  color: #211469;
}
</style>
