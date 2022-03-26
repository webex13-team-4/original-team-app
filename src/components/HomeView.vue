<template>
  <div class="home">
    <!-- {{ docId }} -->
    <input
      type="text"
      v-model="hostPlayer"
      style="width: 300px; height: 40px"
      placeholder="ニックネーム"
      class="input"
    /><br /><br />
    <div class="btn">
      <button v-on:click="start(hostPlayer)">開始</button>
    </div>
  </div>
</template>

<script>
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/firebase.js"
import { ref } from "vue"
import { useRoute } from "vue-router"

export default {
  setup(props, { emit }) {
    const route = useRoute()
    const docId = ref(route.params.id)
    const start = (playerName) => {
      const data = { name: playerName }
      addDoc(collection(db, "rooms", docId.value, "players"), data)
      emit("change-component", "PlayerList")
    }
    return {
      docId,
      start,
    }
  },
}
</script>

<style>
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
