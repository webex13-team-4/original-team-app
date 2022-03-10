<template>
  <h1>結果発表</h1>
  <div>
    実は・・{{ players[shuffleNumber[0]] }}と{{
      players[shuffleNumber[1]]
    }}が入れ替わってました!
  </div>
  <!-- <div>イケディさん正解です！</div> -->
  <!-- {{ shuffleNumber }} -->
</template>

<script>
import { getDoc, doc } from "firebase/firestore"
import { db } from "@/firebase.js"
export default {
  data() {
    return {
      players: [],
      shuffleNumber: [],
    }
  },
  created() {
    const docRef = doc(db, "rooms", this.$route.params.id)
    getDoc(docRef).then((docSnap) => {
      this.shuffleNumber = docSnap.data().shufflenumbers
      this.players = docSnap.data().players
    })
  },
}
</script>
