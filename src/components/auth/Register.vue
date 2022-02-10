<template>
  <div class="d-flex justify-center text-center auth home-container">
    <v-form ref="form" class="login-form" @submit.prevent="register">
      <div class="back-container">
        <v-btn link to="/" icon>
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
      </div>
      <h2 class="login-title">Rejestracja</h2>
      <v-text-field
        color="black"
        :rules="[rules.required]"
        v-model="name"
        label="Imię i nazwisko *"
      ></v-text-field>
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
      <v-text-field
        color="black"
        :rules="[rules.required, confirmPasswordRule]"
        type="password"
        v-model="confirmPassword"
        label="Potwierdź Hasło *"
      ></v-text-field>

      <v-checkbox
        color="black"
        :rules="[rules.required]"
        v-model="rodo1"
        label="Rodo1"
      ></v-checkbox>
      <v-checkbox
        color="black"
        :rules="[rules.required]"
        v-model="rodo2"
        label="Rodo2"
      ></v-checkbox>
      <v-btn type="submit">Wyślij</v-btn>

      <p class="mb-1 mt-5" style="font-size: 0.9rem">Masz już konto?</p>
      <v-btn link to="/logowanie" class="mb-5" color="secondary"
        >Zaloguj się!</v-btn
      >
    </v-form>
  </div>
</template>
<script>
import rules from '@/helpers/validation/rules';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      rodo1: false,
      rodo2: false,
      rules,
    };
  },
  methods: {
    confirmPasswordRule(v) {
      return v == this.password || 'Hasła muszą być identyczne!';
    },
    register() {
      if (!this.$refs.form.validate()) return;

      this.$store.dispatch('register', {
        password: this.password,
        email: this.email,
        name: this.name,
      });
    },
  },
};
</script>
<style></style>
