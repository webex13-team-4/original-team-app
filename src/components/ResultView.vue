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

<style>
.result {
  color: #211469;
  font-weight: bold;
  font-size: 25px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 170px 350px;
  background-color: white;
  border-radius: 30px;
  border: solid 5px #7767cf;
  white-space: nowrap;
}
h1 {
  position: relative;
  top: -80px;
}

.vote {
  position: relative;
  top: -50px;
  opacity: 0;
  animation-name: fadeIn;
  animation-delay: 0.5s;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

span {
  color: red;
  font-size: 50px;
}

.resultp {
  position: relative;
  top: -30px;
  opacity: 0;
  animation-name: fadeIn;
  animation-delay: 1.5s;
  animation-duration: 1.5s;
  animation-fill-mode: forwards;
}

.resultd {
  opacity: 0;
  animation-name: fadeIn;
  animation-delay: 2.5s;
  animation-duration: 2.5s;
  animation-fill-mode: forwards;
}
@keyframes fadeIn {
  /*animation-nameで設定した値を書く*/
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>
