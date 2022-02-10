import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import { firestorePlugin } from "vuefire";
import vuetify from "./plugins/vuetify";
import firebase from "firebase/app";
import "./style.scss";

Vue.use(firestorePlugin);

Vue.config.productionTip = true;

store.commit("loading", true);

firebase.auth().onAuthStateChanged(async (user) => {
  console.log("auth state change");
  console.log(!!user);
  if (!store.getters.authIsLoading) {
    console.log("auth is loading");
    if (user) {
      console.log(user.uid);
      console.log("auth state fetching user data");
      await store.dispatch("bindUserData", user.uid);
    } else {
      await store.dispatch("signOut");
    }
  }
});

new Vue({
  render: (h) => h(App),
  router,
  vuetify,
  store,
}).$mount("#app");
