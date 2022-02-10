<template>
  <div class="d-flex justify-center text-center auth home-container">
    <v-form ref="form" class="login-form" @submit.prevent="login">
      <div class="back-container">
        <v-btn link to="/" icon>
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
      </div>
      <h2 class="login-title">Logowanie</h2>
      <v-text-field
        color="black"
        :rules="[rules.required, rules.email]"
        type="email"
        v-model="email"
        label="Adres E-mail *"
      ></v-text-field>
      <v-text-field
        color="black"
        :rules="[rules.required, rules.passwordLength]"
        type="password"
        v-model="password"
        label="Hasło *"
      ></v-text-field>

      <v-btn class="mt-5" type="submit">Zaloguj się</v-btn>

      <p class="mb-1 mt-5" style="font-size: 0.9rem">Nie masz konta?</p>
      <v-btn link to="/rejestracja" class="mb-5" color="secondary"
        >Zarejestruj się</v-btn
      >
    </v-form>
  </div>
</template>
<script>
import rules from '@/helpers/validation/rules';

export default {
  data() {
    return {
      email: '',
      password: '',
      rules,
    };
  },
  methods: {
    login() {
      if (!this.$refs.form.validate()) return;

      this.$store.dispatch('login', {
        password: this.password,
        email: this.email,
      });
    },
  },
};
</script>
<style>
.login-form {
  min-width: 75%;
  position: relative;
}
.login-title {
  font-size: 2.5rem;
}
</style>
