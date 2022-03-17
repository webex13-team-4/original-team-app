<template>
  <h1>ニックネームを入れてね！</h1>
  <input type="text" v-model="hostPlayer" />
  <div>
    <router-link
      :to="`/${$route.params.id}/0/playerlist`"
      class="navigation__link"
    >
      <button v-on:click="start(hostPlayer)">開始</button>
    </router-link>
  </div>
</template>

<script>
// import { ref } from "vue"
import { setDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "@/firebase.js"
import { useRoute } from "vue-router"
import { componentSubscribe } from "@/lib/game.js"
import { onUnmounted } from "@vue/runtime-core"
export default {
  setup() {
    const route = useRoute()
    const start = (playerName) => {
      const data = { name: playerName }
      setDoc(doc(db, "rooms", route.params.id, "players", "0"), data)
      const compodata = { currentComponent: "playerlist" }
      updateDoc(doc(db, "rooms", route.params.id), compodata)
    }
    onUnmounted(() => {
      componentSubscribe()
    })
    return {
      start,
    }
  },
}
</script>
