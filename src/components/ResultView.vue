<template>
  <div class="result">
    <h1>結果発表</h1>
    <div class="vote">1位{{ votedId }}</div>
    <p class="resultp">実は・・</p>
    <div class="resultd">
      <span>{{ players[shuffleplayersId[0]] }}</span
      >と<span>{{ players[shuffleplayersId[1]] }}</span
      >が入れ替わってました!
    </div>
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

<style>
.result {
  color: #211469;
  font-weight: bold;
  font-size: 25px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 170px 350px;
  background-color: white;
  border-radius: 30px;
  border: solid 5px #7767cf;
  white-space: nowrap;
}
h1 {
  position: relative;
  top: -80px;
}

.vote {
  position: relative;
  top: -50px;
  opacity: 0;
  animation-name: fadeIn;
  animation-delay: 0.5s;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

span {
  color: red;
  font-size: 50px;
}

.resultp {
  position: relative;
  top: -30px;
  opacity: 0;
  animation-name: fadeIn;
  animation-delay: 1.5s;
  animation-duration: 1.5s;
  animation-fill-mode: forwards;
}

.resultd {
  opacity: 0;
  animation-name: fadeIn;
  animation-delay: 2.5s;
  animation-duration: 2.5s;
  animation-fill-mode: forwards;
}
@keyframes fadeIn {
  /*animation-nameで設定した値を書く*/
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>
