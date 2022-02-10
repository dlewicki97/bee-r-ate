<template>
  <div class="d-flex justify-center home home-container">
    <img class="beer-handy" src="@/assets/beer-handy.png" alt="" />
    <div class="home-content">
      <img
        width="auto"
        height="220px"
        src="@/assets/logo.png"
        alt="logo bee-r-ate"
      />
      <h2 class="home-title">Bee-R-ate</h2>
      <p class="home-subtitle">Rozpocznij swoją piwną debatę!</p>
      <div v-if="!$store.getters.user.uid">
        <v-btn class="mb-5" link to="/logowanie" color="secondary"
          >Zaloguj się!</v-btn
        >
        <p class="mb-1" style="font-size: 0.9rem">Nie masz konta?</p>
        <v-btn link to="/rejestracja" color="secondary">Zarejestruj się</v-btn>
      </div>
      <div class="d-flex flex-column" v-else>
        <v-btn link to="/tworzenie-pokoju" class="mb-3" color="secondary"
          >Stwórz pokój!</v-btn
        >
        <v-btn link to="/moje-pokoje" class="mb-3" color="secondary"
          >Moje pokoje</v-btn
        >
        <v-btn link to="/znajomi" class="mb-3" color="secondary"
          >Moi Znajomi</v-btn
        >
        <v-btn link to="/piwa" class="mb-3" color="secondary">Piwa</v-btn>
        <v-btn link to="/profil" class="mb-3" color="secondary"
          >Mój profil</v-btn
        >
        <v-btn @click="signOut" color="#E53935">Wyloguj się</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    signOut() {
      this.$store.dispatch("signOut");
    },
  },
};
</script>

<style>
@media (max-width: 777px) {
  .beer-handy {
    display: none;
  }
}
.home-container.home,
.home-container.auth {
  align-items: center !important;
}

.home-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  /* overflow-y: scroll; */
}
.home-content {
  height: fit-content;
  text-align: center;
  display: flex;
  flex-direction: column;
}
.home-title {
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  line-height: 55px;
}
.home-subtitle {
  font-style: italic;
}
.beer-handy {
  height: 200px;
  width: auto;
  position: absolute;
  top: 10%;
  left: 100%;
  animation-name: beer_handy;
  animation-duration: 4s;
  animation-iteration-count: infinite;
}
button,
a span {
  color: black !important;
}

@keyframes beer_handy {
  0% {
    transform: translate(0);
  }
  50% {
    transform: translate(-100%);
  }
}

html {
  overflow-y: auto !important;
}
</style>
