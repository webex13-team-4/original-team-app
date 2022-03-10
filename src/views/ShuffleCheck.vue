<template>
  {{ text }}
  <router-link
    :to="`/chatview/${this.$route.params.id}/${this.$route.params.playerId}`"
    class="navigation__link"
  >
    <div>
      <button>チャットに参加する。</button>
    </div>
  </router-link>
</template>

<script>
import { getDoc, doc } from "firebase/firestore"
import { db } from "@/firebase.js"
export default {
  data() {
    return {
      players: [],
      shuffleplayers: [],
      irekawari: [],
      text: "",
    }
  },
  created() {
    const docRef = doc(db, "rooms", this.$route.params.id)
    getDoc(docRef).then((docSnap) => {
      this.players = docSnap.data().players
      this.shuffleplayers = docSnap.data().shuffleplayers
      this.irekawari = this.shuffleplayers[this.$route.params.playerId]
      if (
        this.players[this.$route.params.playerId] ===
        this.shuffleplayers.indexOf[this.$route.params.playerId]
      ) {
        this.text = "あなたはシャッフルされていません！"
      } else {
        this.text = `あなたはシャッフルされています。
    ${this.irekawari}
  になりすましてください。`
      }
    })
  },
}
</script>
