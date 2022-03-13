<template>
  <div>
    {{ currentComponent }}
    {{ docId }}
  </div>
  <HomeView
    v-if="currentComponent === 'HomeView'"
    v-on:catchId="getdocId"
    v-on:change-component="changeComponent"
  />
  <PlayerList
    v-if="currentComponent === 'PlayerList'"
    v-on:change-component="changeComponent"
    v-on:send-playerId="saveplayerId"
  />
  <ShuffleCheck
    v-if="currentComponent === 'ShuffleCheck'"
    :players="players"
    v-on:change-component="changeComponent"
  />
  <ChatView
    v-if="currentComponent === 'ChatView'"
    :players="players"
    v-on:change-component="changeComponent"
  />
  <VoteView
    v-if="currentComponent === 'VoteView'"
    :players="players"
    v-on:change-component="changeComponent"
  />
  <ResultView v-if="currentComponent === 'ResultView'" :players="players" />
</template>

<script>
import HomeView from "../components/HomeView.vue"
import PlayerList from "../components/PlayerList.vue"
import ShuffleCheck from "../components/ShuffleCheck.vue"
import ChatView from "../components/ChatView.vue"
import VoteView from "../components/VoteView.vue"
import ResultView from "../components/ResultView.vue"
import { doc, onSnapshot, updateDoc, collection } from "firebase/firestore"
import { db } from "@/firebase.js"

export default {
  components: {
    HomeView,
    PlayerList,
    ShuffleCheck,
    ChatView,
    VoteView,
    ResultView,
  },
  data() {
    return {
      docId: this.$route.params.id,
      currentComponent: "",
      players: [],
    }
  },
  methods: {
    changeComponent(nextComponent) {
      const data = { currentComponent: nextComponent }
      updateDoc(doc(db, "rooms", this.docId), data)
    },
    saveplayerId(playerId) {
      this.$router.replace(`/${this.$route.params.id}/${playerId}`)
    },
  },
  mounted() {
    const Ref = doc(db, "rooms", this.docId)
    onSnapshot(Ref, (Snapshot) => {
      this.currentComponent = Snapshot.data().currentComponent
    })
    const playerRef = collection(db, "rooms", this.$route.params.id, "players")
    onSnapshot(playerRef, (Snapshot) => {
      this.players = []
      Snapshot.forEach((doc) => {
        this.players = [...this.players, doc.data().name]
      })
    })
  },
  // getDoc(collection(db, "rooms", this.$route.params.id)).then((docSnap) => {
  //   this.shuffleplayersId.value = docSnap.data().shuffleplayers
  // })
  // subscribeGameData
}
</script>
