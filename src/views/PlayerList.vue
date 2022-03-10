<template>
  <h1>プレイヤー一覧</h1>
  <div>
    <input type="text" v-model="hostplayer" />
    <button v-on:click="enter(hostplayer)">この名前で入る。</button>
  </div>
  <div>
    <input type="text" v-model="player2" />
    <button v-on:click="enter(player2)">この名前で入る。</button>
  </div>
  <div>
    <input type="text" v-model="player3" />
    <button v-on:click="enter(player3)">この名前で入る。</button>
  </div>

  <button>招待</button>
  <router-link
    :to="`/shufflecheck/${this.$route.params.id}/${this.playerNum}`"
    class="navigation__link"
  >
    <div>
      <button v-on:click="shuffle">シャッフル</button>
    </div>
  </router-link>
  制限時間<input type="number" />分
  {{ this.playerNum }}
</template>

<script>
import { doc, updateDoc, getDoc } from "firebase/firestore"
import { db } from "@/firebase.js"

export default {
  data() {
    return {
      players: [],
      random1: "",
      random2: "",
      hostplayer: "",
      playerNum: "",
    }
  },
  methods: {
    enter(player) {
      this.players.push(player)
      this.playerNum = this.players.indexOf(player)
    },
    shuffle() {
      const data = { players: this.players }
      updateDoc(doc(db, "rooms", this.$route.params.id), data)
      this.random1 = this.getRandomInt(this.players.length)
      this.random2 = this.getRandomInt(this.players.length)
      while (this.random1 === this.random2) {
        this.random2 = this.getRandomInt(this.players.length)
      }
      this.shuffleArray(this.players, this.random1, this.random2)
      const shuffledata = { shuffleplayers: this.players }
      updateDoc(doc(db, "rooms", this.$route.params.id), shuffledata)
      const shufflenumber = { shufflenumbers: [this.random1, this.random2] }
      updateDoc(doc(db, "rooms", this.$route.params.id), shufflenumber)
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * max)
    },
    shuffleArray(array, num1, num2) {
      const trash = array[num1]
      array[num1] = array[num2]
      array[num2] = trash
      return array
    },
  },
  created() {
    const docRef = doc(db, "rooms", this.$route.params.id)
    getDoc(docRef).then((docSnap) => {
      this.hostplayer = docSnap.data().hostplayer
    })
  },
}
</script>
