import { createRouter, createWebHistory } from "vue-router"
import GameView from "../views/GameView.vue"
import StartView from "../views/StartView.vue"
// import PlayerList from "../views/PlayerList.vue"
// import ShuffleCheck from "../views/ShuffleCheck.vue"
// import ChatView from "../views/ChatView.vue"
// import VoteView from "../views/VoteView.vue"
// import ResultView from "../views/ResultView.vue"

const routes = [
  {
    path: "/:id/:playerId",
    name: "gameview",
    component: GameView,
    props: true,
  },
  {
    path: "/",
    name: "startview",
    component: StartView,
  },
]
//   {
//     path: "/playerlist/:id",
//     name: "playerlist",
//     component: PlayerList,
//   },
//   {
//     path: "/shufflecheck/:id/:playerId",
//     name: "shufflecheck",
//     component: ShuffleCheck,
//   },
//   {
//     path: "/chatview/:id/:playerId",
//     name: "chatview",
//     component: ChatView,
//   },
//   {
//     path: "/voteview/:id/:playerId",
//     name: "voteview",
//     component: VoteView,
//   },
//   {
//     path: "/resultview/:id",
//     name: "resultview",
//     component: ResultView,
//   },
// ]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
