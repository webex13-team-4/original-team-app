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
    path: "/playerlist",
    name: "playerlist",
    component: PlayerList,
  },
  {
    path: "/shufflecheck",
    name: "shufflecheck",
    component: ShuffleCheck,
  },
  {
    path: "/chatview",
    name: "chatview",
    component: ChatView,
  },
  {
    path: "/voteview",
    name: "voteview",
    component: VoteView,
  },
  {
    path: "/resultview",
    name: "resultview",
    component: ResultView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
