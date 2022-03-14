<template>
  <h1>結果発表</h1>
  <div>1位{{ votedId }}</div>
  <div>
    実は・・{{ players[shuffleplayersId[0]] }}と{{
      players[shuffleplayersId[1]]
    }}が入れ替わってました!
  </div>
</template>

<script>
// import { getDoc, doc } from "firebase/firestore"
// import { db } from "@/firebase.js"
// import { unsubscribeGameData } from "@/lib/game.js"
import { onSnapshot, collection, getDoc, doc } from "firebase/firestore"
import { onMounted, ref } from "vue"
import { db } from "@/firebase.js"
import { useRoute } from "vue-router"
// import { players, shuffleplayersId } from "@/lib/game.js"
export default {
  // data() {
  //   return {
  //     players: [],
  //     shuffleNumber: [],
  //   }
  // },
  // created() {
  //   const docRef = doc(db, "rooms", this.$route.params.id)
  //   getDoc(docRef).then((docSnap) => {
  //     this.shuffleNumber = docSnap.data().shufflenumbers
  //     this.players = docSnap.data().players
  //   })
  // },
  // unmounted() {
  //   unsubscribeGameData()
  // },
  props: {
    players: [],
  },
  setup() {
    const route = useRoute()
    const votedId = ref([])
    const shuffleplayersId = ref([])

    onMounted(() => {
      // 投票結果算出するのに二重配列使うしかない？
      getDoc(doc(db, "rooms", route.params.id)).then((Snapshot) => {
        shuffleplayersId.value = []
        shuffleplayersId.value = Snapshot.data().shuffleplayersId
      })

      const voteRef = collection(db, "rooms", route.params.id, "votes")
      onSnapshot(voteRef, (Snapshot) => {
        votedId.value = []
        Snapshot.forEach((doc) => {
          let temp = doc.data().votedId
          // 昇順に揃える
          if (temp[0] > temp[1]) {
            let trash = temp[0]
            temp[0] = temp[1]
            temp[1] = trash
          }
          votedId.value = [...votedId.value, temp]
        })
      })
    })
    return {
      shuffleplayersId,
      votedId,
    }
  },
}
</script>
