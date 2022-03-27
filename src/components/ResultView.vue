<template>
  <div class="result">
    <h1>結果発表</h1>
    <p class="most">最も多く投票されたのは・・・</p>
    <div v-for="(voted, index) in maxVotedIds" :key="index">
      <p class="vote">
        {{ players[voted[0]] }}
        と{{ players[voted[1]] }}
      </p>
    </div>
    <p class="resultp">実は・・</p>
    <div class="resultd">
      <span>{{ players[shuffleplayersId[0]] }}</span
      >と<span>{{ players[shuffleplayersId[1]] }}</span
      >が入れ替わってました!
    </div>
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

<style scoped>
.result {
  color: #211469;
  font-weight: bold;
  font-size: 25px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 70px 300px;
  background-color: white;
  border-radius: 30px;
  border: solid 5px #7767cf;
  white-space: nowrap;
}

h1 {
  position: relative;
  top: -60px;
}

.most {
  position: relative;
  top: -50px;
}

.vote {
  position: relative;
  top: -50px;
  opacity: 0;
  animation-name: fadeIn;
  animation-delay: 0.8s;
  animation-duration: 0.8s;
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
