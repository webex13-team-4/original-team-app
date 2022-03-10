<template>
  <h1>題名</h1>
  <h2>アバターとニックネームの選択</h2>
  {{ this.docId }}
  <!-- アバターどうしよう -->
  <input type="text" v-model="hostplayer" />
  <router-link :to="`/playerlist/${this.docId}`" class="navigation__link">
    <div>
      <button v-on:click="start(hostplayer)">開始</button>
    </div>
  </router-link>
</template>

<script>
import { collection, setDoc, addDoc, doc } from "firebase/firestore"
import { db } from "@/firebase.js"

export default {
  data() {
    return {
      docId: "",
    }
  },
  methods: {
    start(player) {
      const data = { hostplayer: player }
      setDoc(doc(db, "rooms", this.docId), data)
    },
  },
  created: async function () {
    let docRef = await addDoc(collection(db, "rooms"), {})
    this.docId = docRef.id
  },
}
</script>
