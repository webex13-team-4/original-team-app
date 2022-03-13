<template>
  <router-link :to="`/${docId}/0`" class="navigation__link">
    <div>
      <button>start!</button>
    </div>
  </router-link>
  {{ docId }}
</template>

<script>
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/firebase.js"

export default {
  data() {
    return {
      docId: "",
    }
  },
  created: async function () {
    const data = { currentComponent: "HomeView" }
    let docRef = await addDoc(collection(db, "rooms"), data)
    this.docId = docRef.id
  },
}
</script>
