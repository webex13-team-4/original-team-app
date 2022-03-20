<template>
  <h1>Chat</h1>
  {{ irekawari }}が参加しました。
  <div>
    <input type="text" v-model="message" />
    <button v-on:click="send">send</button>
  </div>
  <div>残り時間{{ min }}分{{ sec }}秒</div>
  <div v-for="(chat, id) in chats" :key="id">
    {{ chat.name }}:{{ chat.message }}
  </div>
</template>

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

    const message = ref("")
    const send = () => {
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
    }
  },
}
</script>
