<template>
  <h1>ニックネームを入れてね！</h1>
  <input type="text" v-model="hostPlayer" />
  <div>
    <router-link
      :to="`/${$route.params.id}/playerlist`"
      class="navigation__link"
    >
      <button v-on:click="start(hostPlayer)">開始</button>
    </router-link>
  </div>
</template>

<script setup>
import { setDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "@/firebase.js"
import { useRoute } from "vue-router"
import { playerNum } from "@/lib/game.js"
const route = useRoute()
const start = (playerName) => {
  const data = { name: playerName }
  setDoc(doc(db, "rooms", route.params.id, "players", "0"), data)
  const compodata = { currentComponent: "playerlist" }
  updateDoc(doc(db, "rooms", route.params.id), compodata)
  playerNum.value = 0
}
</script>

<style scoped>
.home {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 200px 300px;
  background: linear-gradient(#211469, #1704a7);
  border: solid 5px #7767cf;
  border-radius: 30px;
}

.input {
  background-color: #1704a7;
  text-align: center;
  font-weight: bold;
  border: solid 2px white;
  border-radius: 10px;
  position: relative;
  top: -50px;
}

::placeholder {
  color: white;
}

input,
textarea {
  color: white;
}
</style>
