<template>
  <div class="home">
    <div class="name">
      <input
        type="text"
        v-model="hostPlayer"
        style="width: 300px; height: 30px"
        placeholder="ニックネーム"
        class="input"
      />
      <div>
        <router-link
          :to="`/${$route.params.id}/playerlist`"
          class="navigation__link"
        >
          <button v-on:click="start(hostPlayer)">開始</button>
        </router-link>
      </div>
    </div>
    <div class="ru-ru">
      <h1>役職なし</h1>
      <li>ありのままの自分を語ろう！</li>
      <h1>PRETENDER</h1>
      <li>入れ替わった人になりすましてね！</li>
      <h1>狂人</h1>
      <li>みんなの推測をかく乱しよう！</li>
    </div>
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
  padding: 250px 550px;
  background: linear-gradient(#211469, #1704a7);
  border: solid 5px #7767cf;
  border-radius: 30px;
}

.name {
  position: absolute;
  top: 50%;
  left: 30%;
  transform: translate(-50%, -50%);
  padding: 150px 50px;
  background: linear-gradient(#211469, #1704a7);
  border: solid 5px #7767cf;
  border-radius: 30px;
}

.ru-ru {
  color: white;
  white-space: nowrap;
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 70%;
  transform: translate(-50%, -50%);
  padding: 50px 50px;
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

button {
  position: relative;
  top: 50px;
  color: #1704a7;
  background-color: white;
  opacity: 0.8;
  border: solid white;
  border-radius: 5px;
  font-weight: bold;
  box-shadow: 0px 4px 2px rgb(0, 0, 0);
  padding: 10px 20px;
  cursor: pointer;
}

button:hover {
  opacity: 1;
}

button:action {
  box-shadow: none;
  position: relative;
  top: 6px;
}

input,
textarea {
  color: white;
}
</style>
