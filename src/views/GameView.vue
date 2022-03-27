<template>
  <router-view />
</template>

<script setup>
import { onUnmounted } from "vue"
import { componentSubscribe, playersSubscribe } from "@/lib/game.js"
const compounsubscribe = componentSubscribe()
const playersunsubscribe = playersSubscribe()

onUnmounted(() => {
  compounsubscribe()
  playersunsubscribe()
})
</script>
