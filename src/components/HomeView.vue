<template>
  <h1>ニックネームを入れてね！</h1>
  <input type="text" v-model="hostPlayer" />
  <div>
    <router-link :to="`/${docId}/0/playerlist`" class="navigation__link">
      <button v-on:click="start(hostPlayer)">開始</button>
    </router-link>
  </div>
</template>

<script>
import { setDoc, onSnapshot, doc, updateDoc } from "firebase/firestore"
import { db } from "@/firebase.js"
import { ref, onUnmounted } from "vue"
import { useRoute, useRouter } from "vue-router"
export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    const Ref = doc(db, "rooms", route.params.id)
    const componentunsub = onSnapshot(Ref, (Snapshot) => {
      router.replace(
        `/${route.params.id}/${route.params.playerId}/${
          Snapshot.data().currentComponent
        }`
      )
    })
    const docId = ref(route.params.id)
    const start = (playerName) => {
      const data = { name: playerName }
      setDoc(doc(db, "rooms", docId.value, "players", "0"), data)
      const compodata = { currentComponent: "playerlist" }
      updateDoc(doc(db, "rooms", route.params.id), compodata)
    }
    onUnmounted(() => {
      componentunsub()
    })
    return {
      docId,
      start,
    }
  },
}
</script>
