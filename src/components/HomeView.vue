<template>
  <h1>題名</h1>
  <h2>アバターとニックネームの選択</h2>
  {{ docId }}
  <input type="text" v-model="hostPlayer" />
  <!-- <router-link :to="`/playerlist/${docId}`" class="navigation__link"> -->
  <div>
    <button v-on:click="start(hostPlayer)">開始</button>
  </div>
  <!-- </router-link> -->
</template>

<script>
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/firebase.js"

export default {
  data() {
    return {
      docId: this.$route.params.id,
    }
  },
  methods: {
    start(playerName) {
      const data = { name: playerName }
      addDoc(collection(db, "rooms", this.docId, "players"), data)
      this.$emit("change-component", "PlayerList")
    },
  },
}
</script>
