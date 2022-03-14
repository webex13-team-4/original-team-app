<template>
  <h1>ニックネームを入れてね！</h1>
  <!-- {{ docId }} -->
  <input type="text" v-model="hostPlayer" />
  <div>
    <button v-on:click="start(hostPlayer)">開始</button>
  </div>
</template>

<script>
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/firebase.js"
import { ref } from "vue"
import { useRoute } from "vue-router"

export default {
  setup(props, { emit }) {
    const route = useRoute()
    const docId = ref(route.params.id)
    const start = (playerName) => {
      const data = { name: playerName }
      addDoc(collection(db, "rooms", docId.value, "players"), data)
      emit("change-component", "PlayerList")
    }
    return {
      docId,
      start,
    }
  },
}
</script>
