<template>
  {{ irekawari }}が参加しました。
  <div>
    <input type="text" />
  </div>

  <!-- 本来はボタンではなく制限時間終わり次第強制終了 -->
  <!-- <router-link
    :to="`/voteview/${$route.params.id}/${$route.params.playerId}`"
    class="navigation__link"
  > -->
  <div>
    <button v-on:click="exitChat">チャット終了</button>
  </div>
  <!-- </router-link> -->
</template>

<script>
import { getDoc, doc } from "firebase/firestore"
import { ref, onMounted } from "vue"
import { db } from "@/firebase.js"
import { useRoute } from "vue-router"
// import { players, shuffleplayersId } from "@/lib/game.js"
export default {
  props: {
    players: [],
  },
  // data() {
  //   return {
  //     players: [],
  //     shuffleplayers: [],
  //     irekawari: [],
  //   }
  // },
  // created() {
  //   const docRef = doc(db, "rooms", this.$route.params.id)
  //   getDoc(docRef).then((docSnap) => {
  //     this.players = docSnap.data().players
  //     this.shuffleplayers = docSnap.data().shuffleplayers
  //     this.irekawari = this.shuffleplayers[this.$route.params.playerId]
  //   })
  // },
  setup(props, { emit }) {
    const irekawari = ref("")
    const shuffleplayersId = ref([])
    const route = useRoute()
    const exitChat = () => {
      emit("change-component", "VoteView")
    }
    onMounted(() => {
      // const Ref = collection(db, "rooms", route.params.id, "players")
      // onSnapshot(Ref, (Snapshot) => {
      //   players.value = []
      //   Snapshot.forEach((doc) => {
      //     players.value = [...players.value, doc.data().name]
      //   })
      // })
      // const docRef = collection(db, "rooms", route.params.id, "shuffleplayers")
      // onSnapshot(docRef, (Snapshot) => {
      //   shuffleplayersId.value = []
      //   Snapshot.forEach((doc) => {
      //     shuffleplayersId.value = doc.data().shufflenumbers
      //   })
      // })

      // // ===だと機能しないなあ
      // if (shuffleplayersId.value[0] == route.params.playerId) {
      //   irekawari.value = players.value[shuffleplayersId.value[1]]
      // } else if (shuffleplayersId[1] == route.params.playerId) {
      //   irekawari.value = players.value[shuffleplayersId.value[0]]
      // } else {
      //   irekawari.value = players.value[route.params.playerId]
      // }
      getDoc(doc(db, "rooms", route.params.id)).then((Snapshot) => {
        shuffleplayersId.value = []
        shuffleplayersId.value = Snapshot.data().shuffleplayersId
        console.log(shuffleplayersId.value)
        if (shuffleplayersId.value[0] == route.params.playerId) {
          irekawari.value = props.players[shuffleplayersId.value[1]]
        } else if (shuffleplayersId.value[1] == route.params.playerId) {
          irekawari.value = props.players[shuffleplayersId.value[0]]
        } else {
          irekawari.value = props.players[route.params.playerId]
        }
      })
    })
    return {
      irekawari,
      exitChat,
    }
  },
}
</script>
