<template>
  <div v-if="!roomIsLoading" class="d-flex justify-center home home-container">
    <div class="home-content position-relative" style="width: 100%">
      <div class="back-container" style="top: -2%">
        <v-btn link to="/moje-pokoje" icon>
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
      </div>
      <v-list v-if="room.modID === user.uid" class="py-0 my-5 friend-list">
        <div v-for="(participant, i) in room.participants" :key="i">
          <div v-if="participant.userID !== user.uid && participantsData[i]">
            <v-list-item class="px-0">
              <v-list-item-avatar :size="60" class="ml-3">
                <v-img
                  v-if="participantsData[i].imageURL != null"
                  :src="participantsData[i] ? participantsData[i].imageURL : ''"
                ></v-img>
                <v-avatar v-else class="friend-avatar-placeholder" size="60">
                  {{ generateAvatarPlaceholder(participantsData[i]) }}
                </v-avatar>
              </v-list-item-avatar>

              <v-list-item-content class="position-relative">
                <div class="pr-3 py-3 d-flex">
                  <v-list-item-title
                    v-html="participantsData[i] ? participantsData[i].name : ''"
                  ></v-list-item-title>
                  <v-btn
                    class="ml-3"
                    @click="eliminate(participant, i)"
                    retain-focus-on-click
                    :color="participant.isEliminated ? 'success' : '#E53935'"
                    >{{
                      participant.isEliminated ? "Wyeliminowano" : "Wyeliminuj"
                    }}</v-btn
                  >
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="i != room.participants.length - 1"></v-divider>
          </div>
        </div>
      </v-list>
      <div v-for="(beer, i) in room.beerList" :key="i">
        <div v-if="room.currentBeer == i">
          <img
            class="beer-photo"
            width="280px"
            height="280px"
            :src="beersData[i] ? beersData[i].photoUrl : ''"
            alt="logo bee-r-ate"
          />
          <h2 class="home-title mb-8">
            {{ beersData[i] ? beersData[i].name : "" }}
          </h2>

          <v-container class="d-flex flex-column">
            <v-row class="d-flex flex-column">
              <v-col
                cols="12"
                sm="10"
                md="8"
                class="d-flex flex-column align-self-center rating-sliders"
              >
                <label>Wygląd</label>
                <v-slider
                  step="1"
                  max="5"
                  v-model="appearance"
                  track-color="white"
                  color="black"
                  thumb-label="always"
                ></v-slider>
                <label class="mt-5">Smak</label>
                <v-slider
                  step="1"
                  max="10"
                  v-model="taste"
                  color="black"
                  track-color="white"
                  thumb-label="always"
                ></v-slider>
                <label class="mt-5">Zapach</label>
                <v-slider
                  step="1"
                  max="10"
                  v-model="smell"
                  color="black"
                  track-color="white"
                  thumb-label="always"
                ></v-slider>
                <label class="mt-5">Odczucia w ustach</label>
                <v-slider
                  step="1"
                  max="5"
                  v-model="sensations"
                  color="black"
                  track-color="white"
                  thumb-label="always"
                ></v-slider>
                <label class="mt-5">Subiektywna ocena</label>
                <v-slider
                  step="1"
                  max="20"
                  v-model="subjective"
                  color="black"
                  track-color="white"
                  thumb-label="always"
                ></v-slider>

                <v-btn
                  x-large
                  block
                  class="mt-8"
                  @click="ready"
                  :color="currentParticipant.isReady ? 'error' : 'success'"
                  >{{
                    currentParticipant.isReady ? "Nie gotowy" : "Gotowy"
                  }}</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase/firebase";
import averages from "@/helpers/game/calculateAverages";
import { mapGetters } from "vuex";
import generateAvatar from "@/mixins/avatar";

export default {
  data() {
    return {
      beersData: [],
      participantsData: [],
      taste: 0,
      appearance: 0,
      subjective: 0,
      smell: 0,
      sensations: 0,
    };
  },
  watch: {
    room: {
      deep: true,
      handler(newData) {
        if (!this.room) return;

        if (newData.beerList) this.setBeersData();

        // if (this.room.participants) this.setParticipantsData();
        if (this.room && this.room.ended) {
          this.$router.push(`/wyniki/${this.room.id}`);
        }
      },
    },
    "room.participants"() {
      if (!this.room) return;

      if (this.room.inProgress && this.room.participants) {
        let status = true;
        this.room.participants.forEach((user) => {
          !user.isReady && !user.isEliminated ? (status = false) : true;
        });
        if (status) {
          if (this.room.currentBeer === this.room.beerList.length - 1) {
            this.calculateAverages();
          } else this.nextBeer();
        }
      }
    },
    currentParticipant: {
      handler() {
        if (!this.room) return;

        if (this.room && this.room.isEliminated) {
          this.$store.commit("snackbar", "Przykro mi, zostałeś wyeliminowany!");
          this.$router.push("/");
        }
      },
    },
  },
  computed: {
    ...mapGetters([
      "room",
      "roomIsLoading",
      "user",
      "roomBeers",
      "participantsData",
    ]),

    currentParticipant() {
      if (!this.room) return;
      return this.room.participants
        ? this.room.participants.find(
            (participant) => participant.userID == this.user.uid
          )
        : false;
    },
  },
  methods: {
    generateAvatarPlaceholder(friend) {
      return generateAvatar(friend.name);
    },
    eliminate(participant, i) {
      if (participant.isEliminated) return;
      if (
        !confirm(
          `Czy na pewno wyeliminować osobnika ${this.participantsData[i].name}?`
        )
      )
        return;

      let participants = this.room.participants;
      participants[
        participants.indexOf(
          participants.find((user) => user.userID == participant.userID)
        )
      ].isEliminated = true;

      let beerList = this.room.beerList;
      beerList.forEach((beer) => {
        beer.userScores.splice(
          beer.userScores.indexOf(
            beer.userScores.find(
              (scores) => scores.userID == participant.userID
            )
          ),
          1
        );
      });

      db.collection("rooms")
        .doc(this.room.id)
        .update({ participants, beerList })
        .then(() => {
          db.collection("users")
            .doc(participant.userID)
            .get()
            .then((doc) => {
              let myRooms = doc.data().myRooms;
              myRooms.splice(myRooms.indexOf(this.room.id), 1);
              db.collection("users")
                .doc(participant.userID)
                .update({ myRooms });
            });
        });
    },
    resetScores() {
      this.taste = 0;
      this.smell = 0;
      this.subjective = 0;
      this.sensations = 0;
      this.appearance = 0;
    },
    calculateAverages() {
      averages(this.room);
      this.resetScores();
    },
    nextBeer() {
      this.$store.commit("loading", true);
      let currentBeer = this.room.currentBeer + 1;
      let participants = this.room.participants;
      participants.forEach((user) => (user.isReady = false));
      db.collection("rooms")
        .doc(this.room.id)
        .update({ currentBeer, participants })
        .then(() => {
          this.$store.commit("snackbar", "Kolejne piwo!");
          this.$store.commit("loading", false);
          this.resetScores();
        })
        .catch(() => {
          this.$store.commit("snackbar", "Błąd serwera, przepraszamy...");
          this.$store.commit("loading", false);
        });
    },
    setBeersData() {
      this.room.beerList.forEach(async (beer) => {
        let promise = await db.collection("beers").doc(beer.beerID).get();
        let data = { ...promise.data(), id: promise.id };
        if (
          this.beersData.find((beerData) => beerData.id == data.id) == undefined
        ) {
          this.beersData.push(data);
        }
      });
    },
    setParticipantsData() {
      let promises = [];

      this.room.participants.forEach((participant) => {
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
        participants.forEach((participant) => {
          if (
            !this.participantsData.find(
              (userData) => userData.id === participant.id
            )
          ) {
            this.participantsData.push(participant);
          }
        });
      });
    },
    addScores() {
      let beerList = this.room.beerList;
      let userScores = beerList[this.room.currentBeer].userScores;
      let userScoreIndex = userScores.indexOf(
        userScores.find((user) => user.userID == this.user.uid)
      );
      userScores[userScoreIndex].appearanceScore = this.appearance;
      userScores[userScoreIndex].sensationsScore = this.sensations;
      userScores[userScoreIndex].smellScore = this.smell;
      userScores[userScoreIndex].tasteScore = this.taste;
      userScores[userScoreIndex].subjectiveScore = this.subjective;
      userScores[userScoreIndex].avgScore =
        (this.subjective +
          this.appearance +
          this.sensations +
          this.smell +
          this.taste) /
        5;

      return db
        .collection("rooms")
        .doc(this.room.id)
        .update({ beerList })
        .then(() => {
          this.$store.commit("snackbar", "Zgłosiłeś gotowość!");
          this.$store.commit("loading", false);
        })
        .catch(() => {
          this.$store.commit("snackbar", "Błąd serwera, przepraszamy...");
          this.$store.commit("loading", false);
        });
    },
    async ready() {
      await this.addScores();

      let participants = this.room.participants;
      let status =
        participants[
          participants.indexOf(
            participants.find(
              (participant) => participant.userID == this.user.uid
            )
          )
        ].isReady;

      participants[
        participants.indexOf(
          participants.find(
            (participant) => participant.userID == this.user.uid
          )
        )
      ].isReady = !status;
      db.collection("rooms").doc(this.room.id).update({ participants });
    },
  },
  created() {
    this.$store.dispatch("bindRoom", this.$route.params.id);
  },
};
</script>

<style>
.beer-photo {
  border-radius: 50%;
  object-fit: cover;
}
.rating-sliders {
}
</style>
