import { createRouter, createWebHistory } from "vue-router"
import ChatApp from "@/views/ChatApp.vue"
import GameView from "../views/GameView.vue"
import StartView from "../views/StartView.vue"
import HomeView from "@/components/HomeView.vue"
import PlayerList from "@/components/PlayerList.vue"
import ShuffleCheck from "@/components/ShuffleCheck.vue"
import ChatView from "@/components/ChatView.vue"
import VoteView from "@/components/VoteView.vue"
import ResultView from "@/components/ResultView.vue"

const routes = [
  {
    path: "/:id",
    name: "gameview",
    component: GameView,
    children: [
      { path: "homeview", component: HomeView },
      { path: "playerlist", component: PlayerList },
      { path: "shufflecheck", component: ShuffleCheck },
      { path: "chatview", component: ChatView },
      { path: "voteview", component: VoteView },
      { path: "resultview", component: ResultView },
    ],
  },
  {
    path: "/",
    name: "startview",
    component: StartView,
  },
  {
    path: "/chat",
    name: "ChatApp",
    component: ChatApp,
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
