<template>
  <div id="app">
    <header class="header">
      <h1>Chat</h1>
      <!-- ログイン時にはフォームとログアウトボタンを表示 -->
      <div v-if="user.uid" key="login">
        [{{ user.displayName }}]
        <button type="button" @click="doLogout">ログアウト</button>
      </div>
      <!-- 未ログイン時にはログインボタンを表示 -->
      <div v-else key="logout">
        <button type="button" @click="doLogin">ログイン</button>
      </div>
    </header>

    <transition-group name="chat" tag="div" class="list content">
      <section
        v-for="{ key, name, image, message } in chat"
        :key="key"
        class="item"
      >
        <div class="item-image">
          <img :src="image" width="40" height="40" />
        </div>
        <div class="item-detail">
          <div class="item-name">{{ name }}</div>
          <div class="item-message">
            <!-- <nl2br tag="div" :text="message" /> -->
            {{ message }}
          </div>
        </div>
      </section>
    </transition-group>

    <!-- 入力フォーム -->
    <form action="" @submit.prevent="doSend" class="form">
      <textarea
        v-model="input"
        :disabled="!user.uid"
        @keydown.enter.exact.prevent="doSend"
      ></textarea>
      <button type="submit" :disabled="!user.uid" class="send-button">
        Send
      </button>
    </form>
  </div>
</template>

<script>
import firebase from "firebase/compat/app"
// import Nl2br from "vue-nl2br"
// 改行を <br> タグに変換するモジュール
export default {
  // components: { Nl2br },
  data() {
    return {
      user: {}, // ユーザー情報
      chat: [], // 取得したメッセージを入れる配列
      input: "", // 入力したメッセージ
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user ? user : {}
      const ref_message = firebase.firestore().collection("message")
      ref_message
        .limitToLast(10)
        .orderBy("message")
        .onSnapshot((querySnapshot) => {
          var message = []
          querySnapshot.forEach((doc) => {
            const dataDoc = doc.data()
            dataDoc.key = doc.id
            message.push(dataDoc)
          })
          console.log(message)
          this.chat = message
        })
    })
  },
  methods: {
    // ログイン処理
    doLogin() {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider)
    },
    // ログアウト処理
    doLogout() {
      firebase.auth().signOut()
    },
    // スクロール位置を一番下に移動
    scrollBottom() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.clientHeight)
      })
    },
    // 受け取ったメッセージをchatに追加
    // データベースに新しい要素が追加されると随時呼び出される
    childAdded(snap) {
      const message = snap.val()
      this.chat.push({
        key: snap.key,
        name: message.name,
        image: message.image,
        message: message.message,
      })
      this.scrollBottom()
    },
    doSend() {
      if (this.user.uid && this.input.length) {
        // firebase にメッセージを追加
        firebase
          .firestore()
          .collection("message")
          .add({
            message: this.input,
            name: this.user.displayName,
            image: this.user.photoURL,
          })
          .then(() => {
            this.input = ""
          })
      }
    },
  },
}
</script>
