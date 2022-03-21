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
  {{ votedIds }}
</template>

<script>
import { ref } from "vue"
import { players, shuffleplayersId, votedIds } from "@/lib/game.js"
export default {
  setup() {
    const maxCount = ref(0)
    const maxVotedIds = ref([])

    // 最頻値を求める
    for (let j = 0; j < votedIds.value.length; j++) {
      let count = 0
      for (let i = 0; i < votedIds.value.length; i++) {
        if (votedIds.value[j] === votedIds.value[i]) {
          count = count + 1
        }
      }
      if (maxCount.value < count) {
        maxCount.value = count
        maxVotedIds.value = votedIds.value[j]
      } else if (
        maxCount.value === count &&
        !maxVotedIds.value.includes(votedIds.value[j])
      ) {
        maxVotedIds.value.push(votedIds.value[j])
      }
    }

    return {
      shuffleplayersId,
      votedIds,
      players,
    }
  },
}
</script>
