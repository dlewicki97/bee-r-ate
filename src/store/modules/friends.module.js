import { db } from "@/firebase/firebase";
import firebase from "firebase/app";
import translateErrors from "@/mixins/translateErrors";

export default {
  state: {
    friends: [],
  },
  mutations: {
    friends: (state, friends) => (state.friends = friends),
  },
  getters: {
    friends: (state) => state.friends,
  },
  actions: {
    async friends({ commit, rootGetters }) {
      console.log("fetch friends");
      let friends = [];
      console.log(rootGetters.user);

      for (let id of rootGetters.user.friends) {
        let promise = await db.collection("users").doc(id).get();
        let friend = promise.data();
        friend.id = promise.id;
        friends.push(friend);
      }
      commit("friends", friends);
    },

    addFriend({ commit, rootGetters, dispatch }, searchString) {
      if (searchString.toLowerCase() === rootGetters.user.email.toLowerCase()) {
        commit(
          "snackbar",
          "Myślałem, że brak znajomych to smutek, ale zapraszanie samego siebie... ;)"
        );
        return;
      }

      const usersRef = db.collection("users");

      const uid = rootGetters.user.uid;
      const currentUserRef = db.collection("users").doc(uid);

      commit("loading", true);

      usersRef
        .where("email", "==", searchString)
        .limit(1)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.docs.length === 0) {
            commit("snackbar", "Nie znaleziono użytkownika!");
            commit("loading", false);
          }

          querySnapshot.forEach((userDoc) => {
            const myFriends = rootGetters.friends;

            if (!myFriends.includes(userDoc.id)) {
              const updateUser = currentUserRef
                .update({
                  friends: firebase.firestore.FieldValue.arrayUnion(userDoc.id),
                })
                .catch((err) => {
                  console.log(err);
                  commit("snackbar", translateErrors(err.code));
                });

              const updateFriend = usersRef
                .doc(userDoc.id)
                .update({
                  friends: firebase.firestore.FieldValue.arrayUnion(uid),
                })
                .catch((err) => {
                  console.log(err);
                  commit("snackbar", translateErrors(err.code));
                });

              Promise.all([updateFriend, updateUser]).then(async () => {
                commit("snackbar", "To teraz piwko!");
                await dispatch("friends");
                commit("loading", false);
              });
            } else {
              commit("loading", false);
              commit(
                "snackbar",
                "Już masz tego znajomego. Dodanie go drugi raz nie sprawi, że będzie Cię lubił bardziej..."
              );
            }
          });
        });
    },

    deleteFriend({ commit, rootGetters, dispatch }, exFriend) {
      if (!confirm(`Czy na pewno chcesz usunąć kolegę ${exFriend.name}?`))
        return;

      const usersRef = db.collection("users");
      const uid = rootGetters.user.uid;

      const updateUser = usersRef
        .doc(exFriend.id)
        .update({
          friends: firebase.firestore.FieldValue.arrayRemove(uid),
        })
        .catch((err) => {
          console.log(err);
          commit("snackbar", translateErrors(err.code));
        });

      const updateExFriend = usersRef
        .doc(uid)
        .update({
          friends: firebase.firestore.FieldValue.arrayRemove(exFriend.id),
        })
        .catch((err) => {
          console.log(err);
          commit("snackbar", translateErrors(err.code));
        });

      Promise.all([updateUser, updateExFriend]).then(() => {
        commit("snackbar", "Przykro, że się nie dogadaliście...");
        dispatch("friends");
      });
    },
  },
};
