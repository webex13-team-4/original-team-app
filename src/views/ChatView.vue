<template>
  だーくろが参加しました。
  <div>
    <input type="text" />
  </div>

  <!-- 本来はボタンではなく制限時間終わり次第強制終了 -->
  <router-link to="/voteview" class="navigation__link">
    <div>
      <button>チャット終了</button>
    </div>
  </router-link>
</template>
