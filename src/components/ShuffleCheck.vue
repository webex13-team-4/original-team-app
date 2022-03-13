<template>
  {{ text }}
  <!-- <router-link
    :to="`/chatview/${this.$route.params.id}/${this.$route.params.playerId}`"
    class="navigation__link"
  > -->
  <div>
    <button v-on:click="enterChat">チャットに参加する。</button>
  </div>
  <!-- </router-link> -->
  {{ players }}
  {{ shuffleplayersId }}
  {{ playerId }}
</template>

<script>
import { getDoc, doc } from "firebase/firestore"
import { ref, onMounted } from "vue"
import { db } from "@/firebase.js"
import { useRoute } from "vue-router"
export default {
  props: {
    players: [],
  },
  // data() {
  //   return {
  //     text: "",
  //   }
  // },
  // created() {
  //   if (shuffleplayersId[0] === route.params.playerId) {
  //     this.text = `あなたはシャッフルされています。
  //    ${players.value[shuffleplayersId.value[1]]}
  //  になりすましてください。`
  //   } else if (shuffleplayersId[1] === route.params.playerId) {
  //     this.text = `あなたはシャッフルされています。
  //    ${players.value[shuffleplayersId.value[0]]}
  //  になりすましてください。`
  //   } else {
  //     this.text = "あなたはシャッフルされていません！"
  //   }
  // },
  setup(props, { emit }) {
    const text = ref("")
    const shuffleplayersId = ref([])
    const route = useRoute()
    const enterChat = () => {
      emit("change-component", "ChatView")
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
      // const playerRef = collection(db, "rooms", route.params.id, "players")
      // onSnapshot(playerRef, (Snapshot) => {
      //   players.value = []
      //   Snapshot.forEach((doc) => {
      //     players.value = [...players.value, doc.data().name]
      //   })
      // })
      getDoc(doc(db, "rooms", route.params.id)).then((Snapshot) => {
        shuffleplayersId.value = []
        shuffleplayersId.value = Snapshot.data().shuffleplayersId
        if (shuffleplayersId.value.length === 2) {
          if (shuffleplayersId.value[0] == route.params.playerId) {
            text.value = `あなたはシャッフルされています。
     ${props.players[shuffleplayersId.value[1]]}
   になりすましてください。`
          } else if (shuffleplayersId.value[1] == route.params.playerId) {
            text.value = `あなたはシャッフルされています。
     ${props.players[shuffleplayersId.value[0]]}
   になりすましてください。`
          } else {
            text.value = "あなたはシャッフルされていません！"
          }
        }
      })
      // getDocs(collection(db, "rooms", route.params.id, "players")).then(
      //   (Snapshot) => {
      //     Snapshot.forEach((doc) => {
      //       props.players = [...players.value, doc.data().name]
      //     })
      //   }
      // )
    })
    return {
      text,
      enterChat,
      shuffleplayersId,
    }
  },
}

// const docRef = doc(db, "rooms", route.params.id)
// getDoc(docRef).then((docSnap) => {
//   players.value = [...docSnap.data().players]
// })
// docRefに変更があったとき、コールバックが実行される
// subscribeGameData
</script>
