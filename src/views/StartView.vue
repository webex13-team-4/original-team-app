<template>
  <h1>題名</h1>
  <router-link :to="`/${docId}/homeview`" class="navigation__link">
    <div>
      <button>start!</button>
    </div>
  </router-link>
  {{ docId }}
</template>

<script>
import { collection, addDoc } from "firebase/firestore"
import { ref, onMounted } from "vue"
import { db } from "@/firebase.js"
export default {
  setup() {
    const docId = ref("")
    onMounted(() => {
      const data = { currentComponent: "homeview" }
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

<style scoped>
* {
  margin: 0;
  padding: 0;
}
html {
  height: 100%;
  background: linear-gradient(#211469, #1704a7);
}

.box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 200px 500px;
  background: linear-gradient(#211469, #1704a7);
  border: solid 5px #7767cf;
  border-radius: 30px;
}

.btn button {
  color: #1704a7;
  background-color: white;
  opacity: 0.8;
  border: solid white;
  border-radius: 5px;
  font-weight: bold;
  box-shadow: 0px 4px 2px rgb(0, 0, 0);
  padding: 10px 20px;
  cursor: pointer;
}

.btn button:hover {
  opacity: 1;
}

.btn button:active {
  box-shadow: none;
  position: relative;
  top: 6px;
}

.title {
  color: white;
  font-size: 80px;
  font-weight: bold;
  text-shadow: 0 1px #bbb, 0 2px #aaa, 0 3px #999, 0 4px #888, 0 5px #777,
    0 6px #666, 0 7px #555, 0 8px #444, 0 9px #333, 0 10px 8px #000;
  white-space: nowrap;
  position: relative;
  top: -90px;
  animation: move-y 0.5s infinite alternate ease-in-out;
  display: inline-block;
}
@keyframes move-y {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(10px);
  }
}
</style>
