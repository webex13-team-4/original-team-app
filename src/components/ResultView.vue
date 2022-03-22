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
</template>

<script>
import { ref } from "vue"
import { players, shuffleplayersId, votedIds } from "@/lib/game.js"
export default {
  setup() {
    const maxVotedIds = ref([])
    const MostVotedPairs = ref()

    const getMostVotedPairs = (array) => {
      const obj = {}
      for (let i = 0; i < array.length; i++) {
        obj[String(array[i])] = 0
      }
      for (let i = 0; i < array.length; i++) {
        obj[String(array[i])] += 1
      }
      return obj
    }

    MostVotedPairs.value = getMostVotedPairs(votedIds.value)

    let pairs = Object.entries(MostVotedPairs.value)
    pairs.sort(function (p1, p2) {
      let p1Val = p1[1],
        p2Val = p2[1]
      return p2Val - p1Val
    })
    MostVotedPairs.value = Object.fromEntries(pairs)

    for (let i = 0; i < pairs.length; i++) {
      if (
        Object.entries(MostVotedPairs.value)[0][1] ===
        Object.entries(MostVotedPairs.value)[i][1]
      ) {
        let data = Object.entries(MostVotedPairs.value)[i][0]
        maxVotedIds.value.push(JSON.parse("[" + data + "]"))
      }
    }

    return {
      shuffleplayersId,
      votedIds,
      players,
      MostVotedPairs,
      maxVotedIds,
    }
  },
}
</script>
