<template>
  <div class="d-flex justify-center home-container">
    <v-container
      v-if="!roomIsLoading"
      class="home-content position-relative friends"
    >
      <div class="back-container" style="top: -2%">
        <v-btn link to="/moje-pokoje" icon>
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
      </div>
      <div
        v-if="!editName"
        class="d-flex mb-5 w-100 justify-center align-center"
      >
        <h2 class="home-title mr-2">{{ room.name }}</h2>
        <v-btn
          @click="editName = true"
          large
          icon
          v-if="room.modID === user.uid"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </div>
      <div class="d-flex mb-5 w-100 justify-center align-center mt-3" v-else>
        <v-text-field
          color="black"
          v-model="room.name"
          label="Zmień nazwę pokoju"
        ></v-text-field>
        <v-btn @click="editRoomName" large icon>
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </div>

      <div v-if="room.modID === user.uid && room.participants">
        <h2 class="home-title">Lista piw</h2>
        <p class="home-subtitle">Kliknij w piwo, aby dodać je do listy!</p>

        <v-form @submit.prevent="searchBeers">
          <v-text-field
            color="black"
            label="Znajdź piwo..."
            prepend-icon="mdi-magnify"
            v-model="search"
            :loading="beersAreLoading"
          ></v-text-field>
        </v-form>

        <v-list v-if="beers.length > 0" class="py-0 friend-list no-background">
          <div v-for="(beer, i) in beers" :key="i">
            <div @click="addToBeerList(beer)">
              <v-list-item class="px-0 mb-5 bg-white card-shadow">
                <v-list-item-avatar :size="60" class="ml-3">
                  <v-img :src="beer.photoUrl"></v-img>
                </v-list-item-avatar>

                <v-list-item-content class="position-relative">
                  <div class="pr-3 py-3">
                    <v-list-item-title
                      ><div class="ellipsis">
                        {{ beer.name }}
                      </div></v-list-item-title
                    >
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-divider v-if="i !== roomBeers.length - 1"></v-divider>
            </div>
          </div>
        </v-list>

        <div class="mb-5" v-if="roomBeers.length > 0">
          <h2 class="home-title">Wybrane piwa:</h2>
          <v-list
            v-if="!roomBeersLoading"
            ref="beerListComponent"
            class="py-0 mt-3 friend-list no-background"
          >
            <div v-for="(beer, i) in roomBeers" :key="i">
              <v-list-item class="px-0 mb-5 bg-white card-shadow">
                <v-list-item-avatar :size="60" class="ml-3">
                  <v-img :src="beer.photoUrl"></v-img>
                </v-list-item-avatar>

                <v-list-item-content class="position-relative">
                  <div class="pr-3 py-3">
                    <v-list-item-title
                      ><div class="ellipsis">
                        {{ beer.name }}
                      </div></v-list-item-title
                    >
                  </div>
                  <div class="delete-friend-container">
                    <div>
                      <v-btn
                        small-x
                        class=""
                        @click="deleteFromBeerList(beer)"
                        icon
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-divider v-if="i !== roomBeers.length - 1"></v-divider>
            </div>
          </v-list>
          <div
            v-else
            class="d-flex"
            :style="{
              height: beerListComponentHeight,
              'align-items': 'center',
              'justify-content': 'center',
            }"
          >
            <v-progress-circular
              width="10"
              :size="100"
              color="white"
              indeterminate
            ></v-progress-circular>
          </div>
        </div>

        <h2 class="home-title">Zaproś graczy!</h2>
        <v-list
          v-if="friends.length > 0"
          class="py-0 mt-3 friend-list no-background"
        >
          <div v-for="(friend, i) in friends" :key="i">
            <div
              @click="addParticipant(friend)"
              v-if="
                room.participants.find(
                  (participant) => friend.id == participant.userID
                ) === undefined
              "
            >
              <v-list-item class="px-0 mb-5 bg-white card-shadow">
                <v-list-item-avatar :size="60" class="ml-3">
                  <v-img
                    v-if="friend.imageURL != null"
                    :src="friend.imageURL"
                  ></v-img>
                  <v-avatar v-else class="friend-avatar-placeholder" size="60">
                    {{ generateAvatarPlaceholder(friend) }}
                  </v-avatar>
                </v-list-item-avatar>

                <v-list-item-content class="position-relative">
                  <div class="pr-3 py-3">
                    <v-list-item-title v-html="friend.name"></v-list-item-title>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-divider v-if="i !== friends.length - 1"></v-divider>
            </div>
          </div>
        </v-list>
        <div
          class="mt-3"
          v-if="friends.length === room.participants.length - 1"
        >
          Nie masz w więcej znajomych.
          <router-link to="/znajomi">Kliknij, aby się uspołecznić.</router-link>
        </div>
      </div>

      <h2 class="home-title mt-5 mb-2">Lista graczy</h2>
      <v-list class="py-0 friend-list no-background">
        <div v-for="(participant, i) in room.participants" :key="i">
          <v-list-item
            v-if="participantsData[i]"
            class="px-0 mb-5 bg-white card-shadow"
          >
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
              <div class="pr-1 py-3 d-flex flex-column flex-sm-row">
                <v-list-item-title
                  v-html="participantsData[i] ? participantsData[i].name : ''"
                ></v-list-item-title>
                <v-btn
                  retain-focus-on-click
                  :color="participant.isReady ? 'success' : '#E53935'"
                  >{{ participant.isReady ? "Gotowy" : "Nie gotowy" }}</v-btn
                >
                <v-btn
                  @click="kickParticipant(participant, i)"
                  class="ml-2"
                  v-if="
                    room.modID === user.uid && participant.userID !== user.uid
                  "
                  icon
                >
                  <v-icon color="#E53935">mdi-close</v-icon>
                </v-btn>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-progress-circular
            v-else
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </v-list>

      <v-btn
        class="mt-5"
        :color="mod.isReady ? 'error' : 'success'"
        @click="ready"
        >{{ mod.isReady ? "Nie gotowy" : "Zgłoś gotowość" }}!</v-btn
      >

      <v-btn
        v-if="room.modID == user.uid"
        x-large
        color="secondary"
        @click="start"
        class="mt-10"
        :disabled="
          room.participants
            ? room.participants.some((user) => !user.isReady)
            : true
        "
        >Rozpocznij debatę!</v-btn
      >
    </v-container>
  </div>
</template>

<script>
import { db } from "@/firebase/firebase";
import { mapGetters } from "vuex";
import searchBeersMixin from "@/mixins/searchBeersMixin";
import generateAvatar from "@/mixins/avatar";

export default {
  data() {
    return {
      // participantsData: [],
      editName: false,
      newUser: "",
      search: "",
      beerListComponentHeight: 0,
    };
  },

  mixins: [searchBeersMixin],

  watch: {
    "room.participants"() {
      if (!this.room) return;
      // if (this.room.participants) this.setParticipantsData();
    },
    room: {
      deep: true,
      handler() {
        if (!this.room) return;

        if (
          this.room.participants &&
          !this.room.participants.find(
            (participant) => participant.userID === this.user.uid
          )
        ) {
          this.$store.commit("snackbar", "Zostałeś usunięty z pokoju...");
          this.$router.push("/");
        }
        if (this.room.inProgress) {
          this.$router.push(`/rozgrywka/${this.room.id}`);
        }
      },
    },
  },
  computed: {
    ...mapGetters([
      "room",
      "roomIsLoading",
      "user",
      "beers",
      "roomBeers",
      "beersAreLoading",
      "roomBeersLoading",
      "participantsData",
    ]),

    mod() {
      return this.room.participants == undefined
        ? {}
        : this.room.participants.find((user) => user.userID == this.user.uid);
    },
    friends() {
      return this.$store.getters.friends == undefined
        ? []
        : this.$store.getters.friends;
    },
  },
  methods: {
    generateAvatarPlaceholder(friend) {
      return generateAvatar(friend.name);
    },
    addToBeerList(beer) {
      if (this.roomBeers.some((addedBeer) => addedBeer.id === beer.id)) {
        this.$store.commit("snackbar", "To piwo jest już na liście");
        return;
      }

      if (this.$refs.beerListComponent) {
        this.beerListComponentHeight =
          this.$refs.beerListComponent.$el.clientHeight + "px";
      }

      this.$store.commit("setRoomBeersLoading", true);

      let beerList = this.room.beerList;
      let userScores = [];
      this.room.participants.forEach((participant) => {
        userScores.push({
          userID: participant.userID,
          appearanceScore: 0,
          smellScore: 0,
          tasteScore: 0,
          sensationsScore: 0,
          subjectiveScore: 0,
          avgScore: 0,
        });
      });

      beerList.push({
        beerID: beer.id,
        avgAppearanceScore: 0,
        avgSmellScore: 0,
        avgTasteScore: 0,
        avgSensationsScore: 0,
        avgSubjectiveScore: 0,
        avgScore: 0,
        userScores,
      });

      db.collection("rooms")
        .doc(this.room.id)
        .update({ beerList })
        .then(() => {
          this.$store.commit("snackbar", "Pomyślnie dodano do listy piw!");
        })
        .catch(() => {
          this.$store.commit("snackbar", "Błąd serwera, przepraszamy...");
        });
    },
    deleteFromBeerList(beer) {
      if (this.$refs.beerListComponent) {
        this.beerListComponentHeight =
          this.$refs.beerListComponent.$el.clientHeight + "px";
      }

      this.$store.commit("setRoomBeersLoading", true);

      let beerList = this.room.beerList;
      beerList.splice(beerList.indexOf(beer), 1);
      db.collection("rooms")
        .doc(this.room.id)
        .update({ beerList })
        .then(() => {
          this.$store.commit("snackbar", "Pomyślnie usunięto z listy piw!");
        })
        .catch(() => {
          this.$store.commit("snackbar", "Błąd serwera, przepraszamy...");
        });
    },
    ready() {
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
    editRoomName() {
      this.$store.commit("loading", true);
      db.collection("rooms")
        .doc(this.room.id)
        .update({ name: this.room.name })
        .then(() => {
          this.$store.commit("snackbar", "Pomyślnie zmieniono nazwę!");
          this.$store.commit("loading", false);
          this.editName = false;
        })
        .catch(() => {
          this.$store.commit("snackbar", "Błąd serwera, przepraszamy...");
          this.$store.commit("loading", false);
          this.editName = false;
        });
    },
    kickParticipant(participant, i) {
      if (
        !confirm(
          `Czy na pewno usunąć użytkownika ${this.participantsData[i].name}?`
        )
      )
        return;
      let participants = this.room.participants;
      participants.splice(participants.indexOf(participant), 1);
      let beerList = this.room.beerList;
      beerList.forEach((beer) =>
        beer.userScores.splice(
          beer.userScores.indexOf(
            beer.userScores.find(
              (scores) => scores.userID == participant.userID
            )
          ),
          1
        )
      );

      db.collection("rooms")
        .doc(this.room.id)
        .update({ participants, beerList })
        .then(() => {
          this.$store.commit("snackbar", "Więcej dla reszty");
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
          this.participantsData.splice(i, 1);
        })
        .catch(() => {
          this.$store.commit("snackbar", "Błąd serwera, przepraszamy...");
        });
    },
    addParticipant(friend) {
      let beerList = this.room.beerList;
      beerList.forEach((beer) => {
        beer.userScores.push({
          userID: friend.id,
          appearanceScore: 0,
          smellScore: 0,
          tasteScore: 0,
          sensationsScore: 0,
          subjectiveScore: 0,
          avgScore: 0,
        });
      });

      let participants = this.room.participants;
      participants.push({
        userID: friend.id,
        isEliminated: false,
        isReady: false,
        avgScores: {
          appearance: 0,
          smell: 0,
          taste: 0,
          sensations: 0,
          subjective: 0,
          overall: 0,
        },
      });
      db.collection("rooms")
        .doc(this.room.id)
        .update({ participants, beerList })
        .then(() => {
          this.$store.commit("snackbar", "Dodano uczestnika!");
          db.collection("users")
            .doc(friend.id)
            .get()
            .then((doc) => {
              let myRooms = doc.data().myRooms;
              myRooms.push(this.room.id);
              db.collection("users").doc(friend.id).update({ myRooms });
            });
        })
        .catch(() => {
          this.$store.commit("snackbar", "Błąd serwera, przepraszamy...");
        });
    },

    async start() {
      this.$store.commit("loading", true);
      let participants = this.room.participants;
      participants.forEach((participant) => (participant.isReady = false));

      await db
        .collection("rooms")
        .doc(this.room.id)
        .update({ inProgress: true, participants })
        .then(() => {
          this.$store.commit("snackbar", "Niech rozpocznie się piwna debata!");
          this.$store.commit("loading", false);
        })
        .catch(() => {
          this.$store.commit("snackbar", "Błąd serwera, przepraszamy...");
          this.$store.commit("loading", false);
        });
    },
  },
  created() {
    this.$store.dispatch("bindRoom", this.$route.params.id);
  },
};
</script>

<style>
html {
  word-break: break-word !important;
}

.ellipsis {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
</style>
