<template>
  <div class="d-flex justify-center home home-container">
    <div v-if="!roomIsLoading" class="home-content position-relative w-100">
      <div class="back-container">
        <v-btn link to="/moje-pokoje" icon>
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
      </div>

      <h2 class="home-title mb-8">{{ room.name }} wyniki</h2>
      <v-container
        v-if="room.beerList && room.beerList.length > 0"
        class="py-0 mt-3 friend-list"
      >
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="4"
            v-for="(beer, i) in room.beerList"
            :key="i"
          >
            <div
              class="container px-0 room-card room-card-shadow d-flex flex-column"
            >
              <v-list-item-avatar :size="160" class="ml-3">
                <v-img :src="beersData[i] ? beersData[i].photoUrl : ''"></v-img>
              </v-list-item-avatar>
              <div class="pa-5 text-left">
                <div class="d-flex flex-column">
                  <header
                    class="font-weight-bold mb-2 wrap-title text-center"
                    style="font-size: 2rem"
                    v-html="beersData[i] ? beersData[i].name : ''"
                  ></header>
                  <div class="ratings d-flex flex-column align-self-center">
                    <h4 class="mb-1">Średnie piwa:</h4>
                    <p class="mb-0">
                      Smak: {{ beer.avgTasteScore.toFixed(1) }}
                    </p>
                    <p class="mb-0">
                      Zapach: {{ beer.avgSmellScore.toFixed(1) }}
                    </p>
                    <p class="mb-0">
                      Odczucia w ustach:
                      {{ beer.avgSensationsScore.toFixed(1) }}
                    </p>
                    <p>Wygląd: {{ beer.avgAppearanceScore.toFixed(1) }}</p>
                    <h2>Ogółem: {{ beer.avgScore.toFixed(1) }}</h2>
                  </div>
                </div>
              </div>
            </div>
            <v-divider v-if="i != room.beerList.length - 1"></v-divider>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase/firebase";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      beersData: [],
      participantsData: [],
    };
  },

  computed: {
    ...mapGetters(["room", "roomIsLoading", "user"]),
  },
  watch: {
    room: {
      deep: true,
      handler(newData) {
        if (!newData) return;

        if (newData.beerList) this.setBeersData();
        if (newData.participants) this.setParticipantsData();
      },
    },
  },
  methods: {
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
      this.room.participants.forEach(async (participant) => {
        let promise = await db
          .collection("users")
          .doc(participant.userID)
          .get();
        let data = { ...promise.data(), id: promise.id };
        if (
          this.participantsData.find((userData) => userData.id == data.id) ==
          undefined
        ) {
          this.participantsData.push(data);
        }
      });
    },
  },
  created() {
    this.$store.dispatch("bindRoom", this.$route.params.id);
  },
};
</script>
<style>
.ratings {
  max-width: 176px;
}
</style>
