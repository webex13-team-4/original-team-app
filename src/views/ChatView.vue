<template>
  {{ this.irekawari }}が参加しました。
  <div>
    <input type="text" />
  </div>

  <!-- 本来はボタンではなく制限時間終わり次第強制終了 -->
  <router-link
    :to="`/voteview/${this.$route.params.id}/${this.$route.params.playerId}`"
    class="navigation__link"
  >
    <div>
      <button>チャット終了</button>
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
    }
  },
  created() {
    const docRef = doc(db, "rooms", this.$route.params.id)
    getDoc(docRef).then((docSnap) => {
      this.players = docSnap.data().players
      this.shuffleplayers = docSnap.data().shuffleplayers
      this.irekawari = this.shuffleplayers[this.$route.params.playerId]
    })
  },
}
</script>
