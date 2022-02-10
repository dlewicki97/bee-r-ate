import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store/store";

import Home from "@/pages/Home";
import Register from "@/components/auth/Register";
import Login from "@/components/auth/Login";
import CreateRoom from "@/components/room/CreateRoom";
import Room from "@/components/room/Room";
import RoomListing from "@/components/room/RoomListing";
import Game from "@/components/room/Game";
import Results from "@/components/room/Results";
import Friends from "@/components/friends/Friends";
import Profile from "@/components/profile/Profile.vue";
import BeerList from "@/components/beerlist/BeerList.vue";
import ErrorPage from "@/pages/ErrorPage";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: Home, name: "Home" },
  {
    path: "/rejestracja",
    component: Register,
    name: "Register",
    meta: {
      logged: false,
    },
  },
  {
    path: "/logowanie",
    component: Login,
    name: "Login",
    meta: {
      logged: false,
    },
  },
  {
    path: "/tworzenie-pokoju",
    component: CreateRoom,
    name: "CreateRoom",
    meta: {
      logged: true,
    },
  },
  {
    path: "/znajomi",
    component: Friends,
    name: "Friends",
    meta: {
      logged: true,
    },
  },
  {
    path: "/profil",
    component: Profile,
    name: "Profile",
    meta: {
      logged: true,
    },
  },
  {
    path: "/piwa",
    component: BeerList,
    name: "BeerList",
    meta: {
      logged: true,
    },
  },
  {
    path: "/rozgrywka/:id",
    component: Game,
    name: "Game",
    meta: {
      logged: true,
    },
  },
  {
    path: "/pokoj/:id",
    component: Room,
    name: "Room",
    meta: {
      logged: true,
    },
  },
  {
    path: "/wyniki/:id",
    component: Results,
    name: "Results",
    meta: {
      logged: true,
    },
  },
  {
    path: "/moje-pokoje",
    component: RoomListing,
    name: "RoomListing",
    meta: {
      logged: true,
    },
  },
  {
    path: "/404",
    name: "ErrorPage",
    component: ErrorPage,
    props: {
      code: "{404}",
      msg: "Nie ma takiej stronki!",
    },
  },
  {
    path: "/403",
    name: "ErrorPage",
    component: ErrorPage,
    props: {
      code: "{403}",
      msg: "STOP RIGHT THERE! Nie masz uprawnień do otwarcia tej strony.",
    },
  },
  {
    path: "*",
    redirect: "/404",
  },
];

const router = new VueRouter({
  routes: routes,
  mode: "history",
});

router.beforeEach((to, from, next) => {
  console.log(to.path);

  if (to.matched.some((record) => record.meta.logged)) {
    if (store.getters.user.uid) {
      next();
      return;
    }
    next("/");
  } else {
    next();
  }
});

export default router;
