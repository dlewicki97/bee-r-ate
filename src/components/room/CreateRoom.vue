<template>
  <div class="d-flex justify-center text-center create-room home-container">
    <v-container class="home-content position-relative">
      <div class="back-container" style="top: 0%">
        <v-btn link to="/" icon>
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
      </div>
      <h2 class="home-title">Dodaj listę piw!</h2>
      <p class="home-subtitle">Kliknij w piwo, aby dodać je do listy!</p>

      <v-form @submit.prevent="searchBeers">
        <v-text-field
          color="black"
          label="Znajdź piwo..."
          prepend-icon="mdi-magnify"
          v-model="search"
        ></v-text-field>
      </v-form>

      <v-list v-if="beers.length > 0" class="py-0 friend-list no-background">
        <div v-for="(beer, i) in beers" :key="i" style="cursor: pointer">
          <div @click="addToBeerList(beer)">
            <v-list-item class="px-0 mb-5 bg-white card-shadow">
              <v-list-item-avatar :size="60" class="ml-3">
                <v-img :src="beer.photoUrl"></v-img>
              </v-list-item-avatar>

              <v-list-item-title
                ><div class="ellipsis">{{ beer.name }}</div></v-list-item-title
              >
            </v-list-item>
          </div>
        </div>
      </v-list>
      <div v-else>Zneutralizuj suszę i dodaj piwa</div>

      <div v-if="beerList.length > 0">
        <h2 class="home-title">Wybrane piwa:</h2>
        <v-list class="py-0 mt-3 friend-list no-background">
          <div v-for="(beer, i) in beerList" :key="i">
            <v-list-item class="px-0 mb-5 bg-white card-shadow">
              <v-list-item-avatar :size="60" class="ml-3">
                <v-img :src="beer.photoUrl"></v-img>
              </v-list-item-avatar>

              <v-list-item-content class="position-relative">
                <div class="pr-3 py-3">
                  <v-list-item-title v-html="beer.name"></v-list-item-title>
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
          </div>
        </v-list>
      </div>

      <h2 v-if="invitedFriends.length !== friends.length" class="home-title">
        Zaproś graczy!
      </h2>
      <v-list
        v-if="friends.length > 0"
        class="py-0 mt-3 friend-list no-background"
      >
        <div v-for="(friend, i) in friends" :key="i" style="cursor: pointer">
          <div
            @click="inviteFriend(friend)"
            v-if="invitedFriends.indexOf(friend) === -1"
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
          </div>
        </div>
      </v-list>
      <div class="mt-3" v-else>
        Nie masz w tej chwili znajomych.
        <router-link to="/znajomi">Kliknij, aby się uspołecznić.</router-link>
      </div>

      <div v-if="invitedFriends.length > 0">
        <h2 class="home-title">Lista zaproszonych graczy</h2>
        <v-list class="py-0 mt-3 friend-list no-background">
          <div v-for="(friend, i) in invitedFriends" :key="i">
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
                <div class="delete-friend-container">
                  <div>
                    <v-btn
                      small-x
                      class=""
                      @click="deleteFromInvitedFriends(friend)"
                      icon
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-list>
      </div>

      <v-text-field
        v-model="name"
        class="mt-5"
        color="black"
        label="Wpisz nazwę pokoju"
      ></v-text-field>

      <v-btn
        class="mt-12"
        :disabled="
          beerList.length === 0 || invitedFriends.length === 0 || !name
        "
        color="secondary"
        @click="createRoom"
        >Utwórz pokój</v-btn
      >
    </v-container>
  </div>
</template>

<script>
import { db } from "@/firebase/firebase";
import firebase from "firebase/app";
import searchBeersMixin from "@/mixins/searchBeersMixin";
import generateAvatar from "@/mixins/avatar";

export default {
  data() {
    return {
      beerList: [],
      search: "",
      invitedFriends: [],
      name: "",
    };
  },

  mixins: [searchBeersMixin],

  beforeMount() {
    this.$store.commit("beers", []);
  },
  computed: {
    beersAreLoading() {
      return this.$store.getters.beersAreLoading;
    },
    beers() {
      return this.$store.getters.beers;
    },
    friends() {
      return this.$store.getters.friends;
    },
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    generateAvatarPlaceholder(friend) {
      return generateAvatar(friend.name);
    },
    deleteFromBeerList(beer) {
      this.beerList.splice(this.beerList.indexOf(beer), 1);
    },
    deleteFromInvitedFriends(friend) {
      this.invitedFriends.splice(this.invitedFriends.indexOf(friend), 1);
    },
    addToBeerList(beer) {
      if (this.beerList.some((addedBeer) => addedBeer.id === beer.id)) {
        this.$store.commit("snackbar", "To piwo jest już na liście");
        return;
      }
      this.beerList.push(beer);
    },
    inviteFriend(friend) {
      this.invitedFriends.push(friend);
    },
    saveMyRooms(roomID) {
      let friends = this.invitedFriends;
      friends.push({ id: this.user.uid });
      for (let friend of friends) {
        db.collection("users")
          .doc(friend.id)
          .get()
          .then((doc) => {
            let myRooms = doc.data().myRooms;
            myRooms.push(roomID);
            db.collection("users").doc(friend.id).update({ myRooms });
          });
      }
    },
    createRoom() {
      this.$store.commit("loading", true);
      let beerList = [];
      this.beerList.forEach((beer, i) => {
        beerList.push({
          beerID: beer.id,
          avgAppearanceScore: 0,
          avgSmellScore: 0,
          avgTasteScore: 0,
          avgSensationsScore: 0,
          avgSubjectiveScore: 0,
          avgScore: 0,
          userScores: [],
        });
        this.invitedFriends.forEach((friend) => {
          beerList[i].userScores.push({
            userID: friend.id,
            appearanceScore: 0,
            smellScore: 0,
            tasteScore: 0,
            sensationsScore: 0,
            subjectiveScore: 0,
            avgScore: 0,
          });
        });
        beerList[i].userScores.push({
          userID: this.user.uid,
          appearanceScore: 0,
          smellScore: 0,
          tasteScore: 0,
          sensationsScore: 0,
          subjectiveScore: 0,
          avgScore: 0,
        });
      });

      let participants = [];
      this.invitedFriends.forEach((friend) => {
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
      });
      participants.push({
        userID: this.user.uid,
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
        .add({
          modID: this.user.uid,
          beerList,
          participants,
          inProgress: false,
          name: this.name,
          currentBeer: 0,
          createdAt: null,
        })
        .then((doc) => {
          doc.update({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
          this.$store.commit("loading", false);
          this.$store.commit("snackbar", "Pomyślnie utworzono pokój!");
          this.saveMyRooms(doc.id);
          this.$router.push(`/pokoj/${doc.id}`);
        })
        .catch(() => {
          this.$store.commit("loading", false);
          this.$store.commit("snackbar", "Przepraszamy, błąd serwera...");
        });
    },
  },
};
</script>

<style>
.create-room {
  /*overflow-y: scroll;*/
}

.create-room .home-title {
  margin-top: 2rem !important;
}

a {
  color: white !important;
}

.home-content {
  max-width: 1000px !important;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-background {
  background-color: #ca9b17 !important;
}

.card-shadow {
  border-radius: 20px;
  box-shadow: 2px 2px 2px;
}
</style>
