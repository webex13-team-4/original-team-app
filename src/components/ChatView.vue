<template>
  {{ irekawari }}が参加しました。
  <div>
    <input type="text" />
  </div>
  <div>残り時間{{ min }}分{{ sec }}秒</div>
</template>

<script>
import { doc, updateDoc } from "firebase/firestore"
import { ref } from "vue"
import { db } from "@/firebase.js"
import { useRoute } from "vue-router"
import { players, shuffleplayersId, playerNum, time } from "@/lib/game.js"
export default {
  setup() {
    const min = ref(time.value)
    const sec = ref(0)
    time.value = time.value * 60
    const clock = () => {
      sec.value = time.value % 60
      min.value = Math.floor(time.value / 60)
      time.value = time.value - 1
      if (time.value === 0) {
        const compodata = { currentComponent: "voteview" }
        updateDoc(doc(db, "rooms", route.params.id), compodata)
      }
    }

    window.setInterval(clock, 1000)

    const route = useRoute()

    const irekawari = ref("")

    if (shuffleplayersId.value[0] === playerNum.value) {
      irekawari.value = players.value[shuffleplayersId.value[1]]
    } else if (shuffleplayersId.value[1] === playerNum.value) {
      irekawari.value = players.value[shuffleplayersId.value[0]]
    } else {
      irekawari.value = players.value[playerNum.value]
    }

    return {
      irekawari,
      shuffleplayersId,
      min,
      sec,
    }
  },
}
</script>
