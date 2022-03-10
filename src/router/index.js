import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import PlayerList from "../views/PlayerList.vue"
import ShuffleCheck from "../views/ShuffleCheck.vue"
import ChatView from "../views/ChatView.vue"
import VoteView from "../views/VoteView.vue"
import ResultView from "../views/ResultView.vue"

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/playerlist/:id",
    name: "playerlist",
    component: PlayerList,
  },
  {
    path: "/shufflecheck/:id/:playerId",
    name: "shufflecheck",
    component: ShuffleCheck,
  },
  {
    path: "/chatview/:id/:playerId",
    name: "chatview",
    component: ChatView,
  },
  {
    path: "/voteview/:id/:playerId",
    name: "voteview",
    component: VoteView,
  },
  {
    path: "/resultview/:id",
    name: "resultview",
    component: ResultView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
