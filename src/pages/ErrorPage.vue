<template>
  <div class="d-flex justify-center home home-container">
    <div class="home-content">
      <img
        width="auto"
        height="220px"
        src="@/assets/logo.png"
        alt="logo bee-r-ate"
      />
      <h2 class="home-title">{{ code }}</h2>
      <p class="home-subtitle">{{ msg }}</p>
      <v-btn @click.prevent="navigateToHome">Ale tu nic nie ma!</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    code: String,
    msg: String,
  },

  methods: {
    navigateToHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style>
@media (min-height: 670px) {
  .home-container.home,
  .home-container.auth {
    align-items: center !important;
  }
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
button,
a span {
  color: black !important;
}
</style>
