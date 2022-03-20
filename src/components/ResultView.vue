<template>
  <h1>結果発表</h1>
  最も多く投票されたのは・・・
  <div v-for="(voted, index) in maxVotedIds" :key="index">
    {{ players[voted[0]] }}と{{ players[voted[1]] }}
  </div>
  <div>
    実は・・{{ players[shuffleplayersId[0]] }}と{{
      players[shuffleplayersId[1]]
    }}が入れ替わってました!
  </div>
  {{ votes }}
</template>

<script>
import { ref } from "vue"
import { players, shuffleplayersId, votes } from "@/lib/game.js"
export default {
  setup() {
    const maxCount = ref(0)
    const maxVotedIds = ref([])

    for (let j = 0; j < votes.value.length; j++) {
      let count = 0
      for (let i = 0; i < votes.value.length; i++) {
        if (votes.value[j] === votes.value[i]) {
          count = count + 1
        }
      }
      if (maxCount.value < count) {
        maxCount.value = count
        maxVotedIds.value = votes.value[j]
      } else if (
        maxCount.value === count &&
        !maxVotedIds.value.includes(votes.value[j])
      ) {
        maxVotedIds.value.push(votes.value[j])
      }
    }

    return {
      shuffleplayersId,
      votes,
      players,
    }
  },
}
</script>
