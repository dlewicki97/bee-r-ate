import { fb, db } from "@/firebase/firebase";
import firebase from "firebase/app";
import translateErrors from "@/mixins/translateErrors";

export default {
  actions: {
    editUserPicture({ commit, rootGetters }, file) {
      commit("loading", true);
      const uid = rootGetters.user.uid;

      if (file !== null) {
        const storageRef = fb.storage().ref(`avatars/${uid}/avatar`);
        const uploadTask = storageRef.put(file);

        uploadTask.on(
          "state_changed",
          () => {},
          (err) => {
            console.log(err.code);
            commit("loading", false);
            commit("snackbar", translateErrors(err.code));
          },
          () => {
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then(function (downloadURL) {
                commit("changeUserAvatar", downloadURL);

                db.collection("users")
                  .doc(uid)
                  .update({ imageURL: downloadURL })
                  .then(() => {
                    commit("snackbar", "Pomyślnie dodano zdjęcie!");
                    commit("loading", false);
                  })
                  .catch((err) => {
                    console.log(err.code);
                    commit("loading", false);
                    commit("snackbar", translateErrors(err.code));
                  });
              })
              .catch((err) => {
                console.log(err.code);
                commit("loading", false);
                commit("snackbar", translateErrors(err.code));
              });
          }
        );
      }
    },

    editUserName({ commit, rootGetters }, name) {
      commit("loading", true);

      const uid = rootGetters.user.uid;

      db.collection("users")
        .doc(uid)
        .update({ name: name })
        .then(() => {
          commit("changeUserName", name);
          commit("loading", false);
          commit("snackbar", "Pomyślnie edytowano nazwę!");
        })
        .catch((err) => {
          commit("snackbar", "Wystąpił błąd!");
          commit("loading", false);
          console.log(err);
        });
    },

    editUserEmail({ commit }, { password, email }) {
      commit("loading", true);

      if (email) {
        let user = firebase.auth().currentUser;

        const userRef = db.collection("users").doc(user.uid);

        const credentials = firebase.auth.EmailAuthProvider.credential(
          user.email,
          password
        );

        user
          .reauthenticateWithCredential(credentials)
          .then(() =>
            user
              .updateEmail(email)
              .then(() => {
                userRef.update({ email: email }).then(() => {
                  console.log(user.email);
                  commit("changeUserEmail", email);
                  commit("snackbar", "Pomyślnie zmieniono adres e-mail!");
                  commit("loading", false);
                });
              })
              .catch((err) => {
                console.log(err.code);
                commit("loading", false);
                commit("snackbar", translateErrors(err.code));
              })
              .catch((err) => {
                console.log(err.code);
                commit("loading", false);
                commit("snackbar", translateErrors(err.code));
              })
          )
          .catch((err) => {
            console.log(err.code);
            commit("loading", false);
            commit("snackbar", translateErrors(err.code));
          });
      }
    },

    editUserPassword({ commit }, { newPassword, oldPassword }) {
      if (newPassword) {
        let user = firebase.auth().currentUser;

        const credentials = firebase.auth.EmailAuthProvider.credential(
          user.email,
          oldPassword
        );

        user
          .reauthenticateWithCredential(credentials)
          .then(() =>
            user
              .updatePassword(newPassword)
              .then(() => {
                commit("snackbar", "Pomyślnie zmieniono hasło!");
                commit("loading", false);
              })
              .catch((err) => {
                console.log(err.code);
                commit("loading", false);
                commit("snackbar", translateErrors(err.code));
              })
          )
          .catch((err) => {
            console.log(err.code);
            commit("loading", false);
            commit("snackbar", translateErrors(err.code));
          });
      }
    },
  },
};
