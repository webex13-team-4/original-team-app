<template>
  <div v-if="!shuffle">
    誰と誰が入れ替わっている？
    <button
      v-for="(player, i) in this.players"
      :key="i"
      @click="selectplayer(player)"
      :disabled="this.complete"
    >
      {{ player }}
    </button>
  </div>

  <div v-else>みんな投票中だよ！</div>

  <!-- {{ this.selectplayers }} -->

  <router-link
    :to="`/resultview/${this.$route.params.id}`"
    class="navigation__link"
  >
    <div>
      <button @click="vote">OK</button>
    </div>
  </router-link>
</template>

<script>
import { getDoc, doc, addDoc, collection } from "firebase/firestore"
import { db } from "@/firebase.js"
export default {
  data() {
    return {
      players: [],
      shuffleplayers: [],
      irekawari: [],
      selectplayers: [],
      complete: false,
      shuffle: false,
    }
  },
  methods: {
    selectplayer(player) {
      this.selectplayers.push(player)
      if (this.selectplayers.length === 2) {
        this.complete = true
      }
    },
    vote() {
      const data = { ののか: this.selectplayers }
      addDoc(collection(db, "rooms", this.$route.params.id, "results"), data)
    },
  },
  created() {
    const docRef = doc(db, "rooms", this.$route.params.id)
    getDoc(docRef).then((docSnap) => {
      this.players = docSnap.data().players
      this.shuffleplayers = docSnap.data().shuffleplayers
      this.irekawari = this.shuffleplayers[this.players.indexOf("ののか")]
      if (
        this.players[this.$route.params.playerId] !==
        this.shuffleplayers[this.$route.params.playerId]
      ) {
        this.shuffle = true
      }
    })
  },
}
</script>
