import { db, fb } from "@/firebase/firebase";
import translateErrors from "@/mixins/translateErrors";
import algoliasearch from "algoliasearch";

export default {
  state: {
    beers: [],
    beersAreLoading: false,
  },
  mutations: {
    beers: (state, beers) => (state.beers = beers),

    setBeersLoading: (state, boolean) => {
      state.beersAreLoading = boolean;
    },
  },
  getters: {
    beers: (state) => state.beers,

    beersAreLoading: (state) => state.beersAreLoading,
  },
  actions: {
    searchBeers({ commit }, searchString) {
      console.log("searchBeers");
      if (searchString === "") {
        commit("beers", []);
        return;
      }

      commit("setBeersLoading", true);

      const client = algoliasearch(
        "1EVLQFKKYI",
        "b2b15ecb2631550c0c1fd3551e8046e9"
      );
      const index = client.initIndex("beers");
      const beersRef = db.collection("beers");

      return index
        .search(searchString, {
          hitsPerPage: 10,
        })
        .then(async ({ hits }) => {
          let promises = [];

          for (const hit of hits) {
            const promise = beersRef
              .doc(hit.docID)
              .get()
              .then((doc) => {
                return {
                  doc: doc,
                  algoliaID: hit.objectID,
                };
              });
            promises.push(promise);
          }

          Promise.all(promises).then((searchedBeers) => {
            let beers = [];

            searchedBeers.forEach((beerDoc) => {
              beers.push({
                ...beerDoc.doc.data(),
                id: beerDoc.doc.id,
                algoliaID: beerDoc.algoliaID,
              });
            });

            console.log(beers);
            commit("beers", beers);
            commit("setBeersLoading", false);
          });
        })
        .catch((err) => {
          commit("beers", []);
          commit("setBeersLoading", false);
          console.log(err);
        });
    },

    addBeer({ commit, rootGetters }, { name, file }) {
      commit("loading", true);

      const uid = rootGetters.user.uid;

      return db
        .collection("beers")
        .add({
          name: name,
          photoUrl: null,
          avgAppearanceScore: 0,
          avgSmellScore: 0,
          avgTasteScore: 0,
          avgSensationsScore: 0,
          avgSubjectiveScore: 0,
          avgScore: 0,
          ownerID: uid,
          averageCount: 0,
        })
        .then(async (beerDoc) => {
          const storageRef = fb.storage().ref(`beers/${beerDoc.id}/image`);
          const uploadTask = storageRef.put(file);

          //add object to algolia
          const client = algoliasearch(
            "1EVLQFKKYI",
            "4eb3dbd404f3858730ac32a6946c20f0"
          );
          const index = client.initIndex("beers");

          console.log(beerDoc);

          const objects = [
            {
              name: name,
              docID: beerDoc.id,
            },
          ];

          index
            .saveObjects(objects, {
              autoGenerateObjectIDIfNotExist: true,
            })
            .then(({ objectIDs }) => {
              console.log(objectIDs);
            });

          await uploadTask.on(
            "state_changed",
            () => {},
            (err) => {
              commit("snackbar", translateErrors(err.code));
              commit("loading", false);
            },
            () => {
              uploadTask.snapshot.ref
                .getDownloadURL()
                .then((downloadURL) => {
                  beerDoc
                    .update({
                      photoUrl: downloadURL,
                    })
                    .then(async () => {
                      commit("snackbar", "Na zdrówko!");
                      commit("loading", false);
                    });
                })
                .catch((err) => {
                  commit("snackbar", translateErrors(err.code));
                  commit("loading", false);
                });
            }
          );
        })
        .catch((err) => {
          console.log(err);
          commit("snackbar", translateErrors(err.code));
          commit("loading", false);
        });
    },

    async editBeer({ commit }, { algoliaID, beerID, name, editFile }) {
      commit("loading", true);
      if (editFile != null) {
        const storageRef = fb.storage().ref(`beers/${beerID}/${editFile.name}`);
        const uploadTask = storageRef.put(editFile);

        await uploadTask.on(
          "state_changed",
          () => {},
          (error) => console.log(error),
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              db.collection("beers")
                .doc(beerID)
                .update({ photoUrl: downloadURL, name: name })
                .then(() => {
                  commit("snackbar", "Edytowano zdjęcię!");
                  commit("loading", false);
                })
                .catch(() => {
                  commit("snackbar", "Błąd serwera, przepraszamy...");
                  commit("loading", false);
                });
            });
          }
        );
      } else {
        await db
          .collection("beers")
          .doc(beerID)
          .update({ name: name })
          .then(() => {
            commit("snackbar", "Edytowano nazwę!");
            commit("loading", false);
            editFile = null;
          });
      }

      if (name) {
        //edit object in algolia
        const client = algoliasearch(
          "1EVLQFKKYI",
          "4eb3dbd404f3858730ac32a6946c20f0"
        );
        const index = client.initIndex("beers");

        console.log(algoliaID);

        const objects = [
          {
            name: name,
            docID: beerID,
            objectID: algoliaID,
          },
        ];

        index.saveObjects(objects, {}).then(({ objectIDs }) => {
          console.log(objectIDs);
        });
      }
    },
  },
};
