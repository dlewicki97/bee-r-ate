<template>
  <div class="d-flex justify-center room-listing home-container h-100">
    <v-container class="home-content h-100">
      <div class="back-container">
        <v-btn link to="/" icon>
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
      </div>
      <h2 class="home-title">Moje pokoje</h2>

      <v-container
        v-if="rooms.length > 0"
        class="py-0 mt-3 friend-list"
        style="height: 100%"
      >
        <v-row v-if="!myRoomsAreLoading">
          <v-col cols="12" sm="6" md="4" v-for="(room, i) in myRooms" :key="i">
            <router-link
              class="text-decoration-none"
              :to="room ? setRoomLink(room) : '/moje-pokoje'"
            >
              <v-list-item
                class="px-0 room-card room-card-shadow"
                :class="{ 'room-card--inProgress': progressStatus(room) }"
              >
                <v-list-item-content class="pa-5 pb-0">
                  <div>
                    <v-list-item-avatar :size="100" class="ml-3">
                      <v-img
                        v-if="room.mod.imageURL != null"
                        :src="room.mod.imageURL"
                      ></v-img>
                      <v-avatar
                        v-else
                        class="friend-avatar-placeholder"
                        size="100"
                      >
                        {{ generateAvatarPlaceholder(room.mod) }}
                      </v-avatar>
                    </v-list-item-avatar>
                    <div>
                      <v-list-item-title
                        class="wrap-title pb-2"
                        v-html="room ? room.name : ''"
                      ></v-list-item-title>
                      <v-list-item-subtitle>
                        {{ progressTitle(progressStatus(room)) }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle class="room-card__timestamp">
                        <small>
                          {{
                            myRooms[i] ? returnDate(myRooms[i].createdAt) : ""
                          }}
                        </small>
                      </v-list-item-subtitle>
                    </div>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </router-link>
          </v-col>
        </v-row>
        <div v-else class="progress-container">
          <v-progress-circular
            indeterminate
            color="white"
            width="10"
            :size="100"
          ></v-progress-circular>
        </div>
      </v-container>
      <div class="mt-3" v-else>
        Nie masz w tej chwili pokojów. <br /><router-link to="/tworzenie-pokoju"
          >Kliknij, aby stworzyć pokój!</router-link
        >
      </div>
    </v-container>
  </div>
</template>

<script>
import generateAvatar from "@/mixins/avatar";
import { mapGetters } from "vuex";

export default {
  watch: {
    rooms() {
      this.getRoomsData();
    },
  },
  computed: {
    ...mapGetters(["myRoomsAreLoading", "myRooms", "user"]),

    rooms() {
      return this.$store.getters.user.myRooms;
    },
  },
  methods: {
    generateAvatarPlaceholder(mod) {
      return generateAvatar(mod.name);
    },
    returnDate(timestamp) {
      const date = timestamp.toDate();

      function prependTime(time) {
        if (time < 10) {
          time = "0" + time.toString();
        }
        return time;
      }

      return (
        prependTime(date.getHours()) +
        ":" +
        prependTime(date.getMinutes()) +
        " " +
        prependTime(date.getDate()) +
        "." +
        prependTime(date.getMonth() + 1) +
        "." +
        date.getFullYear()
      );
    },
    progressTitle(progress) {
      switch (progress) {
        case 1:
          return "W trakcie";
        case 2:
          return "Nierozpoczęty";
        default:
          return "Zakończony";
      }
    },
    progressStatus(room) {
      if (room.ended) return 0;
      else if (room.inProgress) return 1;
      else if (!room.inProgress) return 2;
      return 0;
    },
    setRoomLink(room) {
      let segment = "pokoj";

      if (room.ended) segment = "wyniki";
      else if (room.inProgress) segment = "rozgrywka";
      else if (!room.inProgress) segment = "pokoj";

      return `/${segment}/${room.id}`;
    },

    getRoomsData() {
      this.$store.dispatch("getRoomsData");
    },
  },
  created() {
    this.getRoomsData();
  },
};
</script>

<style>
.room-card {
  background-color: white;
}

.room-card--inProgress {
}

.ellipsis {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.room-card__timestamp {
  height: 20px;
  text-align: right;
}

.no-underline {
  text-decoration: none !important;
}

.room-card-shadow {
  border-radius: 40px;
  box-shadow: 5px 5px 5px;
}
</style>
