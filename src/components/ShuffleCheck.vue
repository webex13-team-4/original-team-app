<template>
  <div class="shuffle">
    <div class="chattext">
      {{ text }}
      <!-- <p v-html="htmlText(text)"></p> -->
    </div>
    <div>
      <button v-on:click="enterChat" class="chatbtn">
        チャットに参加する。
      </button>
    </div>
    <!-- {{ players }}
  {{ shuffleplayersId }}
  {{ playerId }} -->
  </div>
</template>

<script>
import { getDoc, doc } from "firebase/firestore"
import { ref, onMounted } from "vue"
import { db } from "@/firebase.js"
import { useRoute } from "vue-router"
export default {
  props: {
    players: [],
  },
  setup(props, { emit }) {
    const text = ref("")
    const shuffleplayersId = ref([])
    const route = useRoute()
    const enterChat = () => {
      emit("change-component", "ChatView")
    }

    onMounted(() => {
      getDoc(doc(db, "rooms", route.params.id)).then((Snapshot) => {
        shuffleplayersId.value = []
        shuffleplayersId.value = Snapshot.data().shuffleplayersId
        if (shuffleplayersId.value.length === 2) {
          if (shuffleplayersId.value[0] == route.params.playerId) {
            text.value = `あなたはシャッフルされています。
     ${props.players[shuffleplayersId.value[1]]} 
   になりすましてください。`
          } else if (shuffleplayersId.value[1] == route.params.playerId) {
            text.value = `あなたはシャッフルされています。
     ${props.players[shuffleplayersId.value[0]]}
   になりすましてください。`
          } else {
            text.value = "あなたはシャッフルされていません！"
          }
        }
      })
    })

    return {
      text,
      enterChat,
      shuffleplayersId,
    }
  },
}
</script>

<style>
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
</style>
