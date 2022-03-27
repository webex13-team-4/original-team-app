<template>
  <h1>Chat</h1>
  <div class="time-limit">残り{{ min }}分{{ sec }}秒</div>
  <div class="chat-container">
    <p class="aisatu">まずは挨拶してみましょう！</p>
    <div v-for="(chat, id) in chats" :key="id">
      <div v-if="chat.name === irekawari" class="right-container">
        <p class="player-name">{{ chat.name }}</p>
        <div class="right-says">
          <p class="message-container">{{ chat.message }}</p>
        </div>
      </div>
      <div v-else class="left-container">
        <p class="player-name">{{ chat.name }}</p>
        <div class="left-says">
          <p class="message-container">{{ chat.message }}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="message-input">
    <input
      type="text"
      v-model="message"
      class="text-input"
      v-on:keydown.enter="send"
      @compositionstart="composing = true"
      @compositionend="composing = false"
      :placeholder="`${irekawari}としてメッセージを入力`"
    />
  </div>
</template>

<style scoped>
.chat-container {
  margin-bottom: 20px;
  overflow: scroll;
  height: 600px;
}

.text-input {
  display: inline-block;
  width: 700px;
}

h1 {
  color: white;
}
.aisatu {
  color: white;
  font-weight: bold;
}
.time-limit {
  color: white;
  position: absolute;
  top: 50px;
  right: 50px;
  font-size: 25px;
}

.right-container {
  margin-right: 20%;
  text-align: right;
  margin-bottom: 10px;
}
.left-container {
  margin-left: 20%;
  text-align: left;
  margin-bottom: 10px;
}

.right-says {
  display: inline-block;
  position: relative;
  margin: 0 0 0 50px;
  padding: 10px;
  max-width: 250px;
  border-radius: 12px;
  background: #edf1ee;
}

.message-container {
  word-wrap: break-word;
  white-space: normal;
  text-align: left;
}

.right-says:after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 3px;
  right: -19px;
  border: 8px solid transparent;
  border-left: 18px solid #edf1ee;
  -webkit-transform: rotate(35deg);
  transform: rotate(-35deg);
}
.right-says p {
  margin: 0;
  padding: 0;
}
.left-says {
  display: inline-block;
  position: relative;
  margin: 0 50px 0 0;
  padding: 10px;
  max-width: 250px;
  border-radius: 12px;
  background: #edf1ee;
}

.left-says:after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 3px;
  left: -19px;
  border: 8px solid transparent;
  border-right: 18px solid #edf1ee;
  -webkit-transform: rotate(35deg);
  transform: rotate(35deg);
}
.left-says p {
  margin: 0;
  padding: 0;
}

.player-name {
  color: white;
  margin-bottom: 0;
  font-size: 5px;
}
</style>

<script>
import {
  doc,
  updateDoc,
  onSnapshot,
  addDoc,
  collection,
  orderBy,
  query,
} from "firebase/firestore"
import { ref, onUnmounted } from "vue"
import { db } from "@/firebase.js"
import { useRoute } from "vue-router"
import { players, shuffleplayersId, playerNum } from "@/lib/game.js"
export default {
  setup() {
    const min = ref("")
    const sec = ref("")
    const time = ref("")
    const chats = ref([])

    const route = useRoute()
    const Ref = doc(db, "rooms", route.params.id)
    const timeunsub = onSnapshot(Ref, async (Snapshot) => {
      time.value = await Snapshot.data().time
      min.value = await Snapshot.data().min
      sec.value = await Snapshot.data().sec
    })
    if (playerNum.value === 0) {
      let timer = setInterval(function () {
        sec.value = time.value % 60
        min.value = Math.floor(time.value / 60)
        time.value = time.value - 1
        const timedata = { time: time.value, sec: sec.value, min: min.value }
        updateDoc(doc(db, "rooms", route.params.id), timedata)
        if (sec.value === 0 && min.value === 0) {
          clearInterval(timer)
          const compodata = { currentComponent: "voteview" }
          updateDoc(doc(db, "rooms", route.params.id), compodata)
        }
      }, 1000)
    }

    const irekawari = ref("")

    if (shuffleplayersId.value[0] === playerNum.value) {
      irekawari.value = players.value[shuffleplayersId.value[1]]
    } else if (shuffleplayersId.value[1] === playerNum.value) {
      irekawari.value = players.value[shuffleplayersId.value[0]]
    } else {
      irekawari.value = players.value[playerNum.value]
    }

    const composing = ref(false)
    const message = ref("")
    const send = () => {
      if (!composing.value && message.value) {
        const data = {
          name: irekawari.value,
          message: message.value,
          now: new Date(),
        }
        addDoc(collection(db, "rooms", route.params.id, "messages"), data).then(
          () => {
            message.value = ""
          }
        )
      }
    }

    const chatRef = query(
      collection(db, "rooms", route.params.id, "messages"),
      orderBy("now")
    )
    const chatunsub = onSnapshot(chatRef, (Snapshot) => {
      chats.value = []
      Snapshot.forEach((doc) => {
        chats.value = [...chats.value, doc.data()]
      })
    })

    onUnmounted(() => {
      timeunsub()
      chatunsub()
    })
    return {
      irekawari,
      shuffleplayersId,
      min,
      sec,
      send,
      chats,
      message,
      composing,
    }
  },
}
</script>
