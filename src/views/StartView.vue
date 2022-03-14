<template>
  <h1>題名</h1>
  <router-link :to="`/${docId}/0`" class="navigation__link">
    <div>
      <button>start!</button>
    </div>
  </router-link>
  <!-- {{ docId }} -->
</template>

<script>
import { collection, addDoc } from "firebase/firestore"
import { ref, onMounted } from "vue"
import { db } from "@/firebase.js"

export default {
  setup() {
    const docId = ref("")
    onMounted(() => {
      const data = { currentComponent: "HomeView" }
      addDoc(collection(db, "rooms"), data).then((docRef) => {
        docId.value = docRef.id
      })
    })
    return {
      docId,
    }
  },
}
</script>
