<template>
  <router-view />
</template>

<script setup>
import { onUnmounted } from "vue"
import { componentSubscribe, playersSubscribe } from "@/lib/game.js"
const compounsubscribe = componentSubscribe()
const playersunsubscribe = playersSubscribe()

onUnmounted(() => {
  console.log("通信が切断されました...!")
  compounsubscribe()
  playersunsubscribe()
})
</script>
