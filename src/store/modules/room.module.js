import { db } from "@/firebase/firebase";
import { firestoreAction } from "vuexfire";

export default {
  state: {
    room: {},
    roomBeers: [],
    myRooms: [],
    roomIsLoading: true,
    roomBeersLoading: false,
    myRoomsAreLoading: false,
    participantsData: [],
  },

  getters: {
    participantsData: (state) => state.participantsData,

    myRoomsAreLoading: (state) => state.myRoomsAreLoading,

    roomBeersLoading: (state) => state.roomBeersLoading,

    roomBeers: (state) => state.roomBeers,

    room: (state) => {
      console.log(state.room);
      return state.room;
    },

    roomIsLoading: (state) => state.roomIsLoading,

    myRooms: (state) => state.myRooms,
  },

  mutations: {
    setParticipantsData(state, participantsData) {
      state.participantsData = participantsData;
    },

    setMyRoomsAreLoading: (state, boolean) =>
      (state.myRoomsAreLoading = boolean),

    setRoomBeersLoading: (state, boolean) => (state.roomBeersLoading = boolean),

    room: (state, room) => (state.room = room),

    roomIsLoading(state, boolean) {
      state.roomIsLoading = boolean;
    },

    setMyRooms(state, myRooms) {
      state.myRooms = myRooms;
    },

    setRoomBeers(state, beers) {
      state.roomBeers = beers;
    },
  },

  actions: {
    fetchBeersData({ commit }, beerList) {
      console.log("fetching beers data");
      commit("setRoomBeersLoading", true);

      const beersRef = db.collection("beers");

      let promises = [];

      beerList.forEach((beer) => {
        const promise = beersRef
          .doc(beer.beerID)
          .get()
          .then((beerDoc) => {
            console.log("fetching beers ended");
            return {
              ...beerDoc.data(),
              id: beerDoc.id,
            };
          })
          .catch((err) => {
            console.log(err);
            commit("setRoomBeers", []);
            commit("setRoomBeersLoading", false);
          });
        promises.push(promise);
      });

      return Promise.all(promises).then((beers) => {
        commit("setRoomBeersLoading", false);
        commit("setRoomBeers", beers);
      });
    },

    fetchParticipantsData({ commit }, participants) {
      let promises = [];

      participants.forEach((participant) => {
        let promise = db
          .collection("users")
          .doc(participant.userID)
          .get()
          .then((userDoc) => {
            return {
              ...userDoc.data(),
              id: userDoc.id,
            };
          });

        promises.push(promise);
      });

      Promise.all(promises).then((participants) => {
        console.log(participants);

        commit("setParticipantsData", participants);

        console.log("participants ended");
      });
    },

    bindRoom: firestoreAction(
      ({ bindFirestoreRef, dispatch, commit, rootGetters }, roomID) => {
        console.log("binasfasodfnasofnasjnflasjnflasjnflajkndflasdf");

        commit("roomIsLoading", true);
        commit("loading", true);
        const roomRef = db.collection("rooms").doc(roomID);

        const serialize = (doc) => {
          const data = doc.data();

          const roomBeers = rootGetters.roomBeers;
          const roomParticipants = rootGetters.participantsData;

          let newReadyArray = [];
          let oldReadyArray = [];

          data.participants.forEach((participant) => {
            newReadyArray.push(participant.isReady);
          });

          roomParticipants.forEach((participant) => {
            oldReadyArray.push(participant.isReady);
          });

          function arraysChanges(x, y) {
            return x.toString() !== y.toString();
          }

          if (arraysChanges(roomBeers, data.beerList)) {
            dispatch("fetchBeersData", data.beerList);
          }

          if (arraysChanges(newReadyArray, oldReadyArray)) {
            dispatch("fetchParticipantsData", data.participants);
          }

          Object.defineProperty(data, "id", { value: doc.id });

          return data;
        };

        return bindFirestoreRef("room", roomRef, {
          serialize,
        }).then(async (room) => {
          await dispatch("fetchBeersData", room.beerList);
          commit("loading", false);
          commit("roomIsLoading", false);
        });
      }
    ),

    getRoomsData({ commit, rootGetters }) {
      commit("setMyRooms", []);
      commit("setMyRoomsAreLoading", true);

      const rooms = rootGetters.user.myRooms;
      const usersRef = db.collection("users");
      if (rooms.length > 0) {
        let myRooms = [];
        let promises = [];

        rooms.forEach(async (room) => {
          let promise = db
            .collection("rooms")
            .doc(room)
            .get()
            .then(async (doc) => {
              if (!doc.exists) return false;

              const modID = doc.data().modID;
              let object = {
                ...doc.data(),
                id: doc.id,
              };

              await usersRef
                .doc(modID)
                .get()
                .then((modDoc) => {
                  object.mod = modDoc.data();
                });

              return object;
            })
            .catch((err) => {
              console.log(err.code);
              commit("setMyRoomsAreLoading", false);
              commit("setMyRooms", []);
            });
          promises.push(promise);
        });

        Promise.all(promises).then((beers) => {
          beers.reduceRight(function (acc, item, index, object) {
            if (!item) {
              object.splice(index, 1);
            }
          }, []);

          myRooms.push(...beers);
          commit(
            "setMyRooms",
            myRooms.sort((x, y) => y.createdAt.toDate() - x.createdAt.toDate())
          );
          commit("setMyRoomsAreLoading", false);
        });
      }
    },
  },
};
