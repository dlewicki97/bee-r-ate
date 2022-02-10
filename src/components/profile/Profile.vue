<template>
  <div class="d-flex justify-center home-container profile">
    <div class="home-content justify-center align-center text-center">
      <div class="back-container ma-0">
        <v-btn link to="/" icon>
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
      </div>
      <img
        v-if="activePhoto != null"
        class="profile-photo"
        :src="activePhoto"
        alt="avatar"
      />
      <v-avatar v-else class="avatar-placeholder" size="150">
        {{ generateAvatarPlaceholder() }}
      </v-avatar>

      <h2 class="home-title mb-3">Edytuj profil</h2>
      <v-container>
        <v-form ref="avatarForm" @submit.prevent.prevent="editProfilePicture">
          <v-row>
            <v-col cols="12" class="py-2">
              <v-file-input
                show-size
                accept="image/png, image/jpeg, image/bmp, image/gif, image/svg, image/jfif"
                :rules="[rules.fileSize, rules.required]"
                color="black"
                class="mt-0"
                v-model="file"
                label="Zdjęcie"
              ></v-file-input>
              <v-btn type="submit" class="mb-3" color="secondary"
                >Zmień zdjęcie</v-btn
              >
            </v-col>
          </v-row>
        </v-form>

        <v-form ref="nameForm" @submit.prevent="editProfileName">
          <v-row>
            <v-col cols="12" class="py-2">
              <v-text-field
                color="black"
                class="mt-0"
                v-model="name"
                label="Imię i nazwisko"
              ></v-text-field>
              <v-btn type="submit" class="mb-3 mt-2" color="secondary"
                >Zmień nazwę</v-btn
              >
            </v-col>
          </v-row>
        </v-form>

        <v-form ref="emailForm" @submit.prevent="editProfileEmail">
          <v-row>
            <v-col cols="12" class="py-2">
              <v-text-field
                color="black"
                class="mt-0"
                :rules="[rules.required, rules.email]"
                v-model="email"
                label="Adres E-mail"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-2">
              <v-text-field
                color="black"
                type="password"
                :rules="[
                  emailPasswordOperation,
                  rules.required,
                  rules.passwordLength,
                ]"
                class="mt-0"
                v-model="emailPassword"
                label="Hasło"
              ></v-text-field>
              <v-btn type="submit" class="mb-3 mt-2" color="secondary"
                >Zmień adres e-mail</v-btn
              >
            </v-col>
          </v-row>
        </v-form>

        <v-form ref="passwordForm" @submit.prevent="editProfilePassword">
          <v-row>
            <v-col cols="12" class="py-2">
              <v-text-field
                color="black"
                type="password"
                :rules="[
                  passwordOperation,
                  rules.required,
                  rules.passwordLength,
                ]"
                class="mt-0"
                v-model="oldPassword"
                label="Stare hasło"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-2">
              <v-text-field
                color="black"
                type="password"
                :rules="[
                  newPasswordOperation,
                  rules.passwordLength,
                  rules.required,
                ]"
                class="mt-0"
                v-model="newPassword"
                label="Nowe hasło"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-2">
              <v-text-field
                color="black"
                type="password"
                :rules="[checkConfirmPassword, rules.required]"
                class="mt-0"
                v-model="confirmPassword"
                label="Powtórz Nowe hasło"
              ></v-text-field>

              <v-btn type="submit" class="mb-3 mt-2" color="secondary"
                >Zmień hasło</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </div>
  </div>
</template>

<script type="text/javascript">
import rules from "@/helpers/validation/rules";
import generateAvatar from "@/mixins/avatar";

export default {
  data() {
    return {
      name: "",
      email: "",
      emailPassword: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      file: null,
      rules,
    };
  },

  created() {
    this.name = this.user.name;
    this.email = this.user.email;
  },

  methods: {
    generateAvatarPlaceholder() {
      return generateAvatar(this.user.name);
    },

    editProfilePicture() {
      if (!this.$refs.avatarForm.validate() || this.file === null) return;

      if (this.file) {
        this.$store.dispatch("editUserPicture", this.file);
      }
    },

    editProfileName() {
      if (!this.$refs.nameForm.validate()) return;

      this.$store.dispatch("editUserName", this.name);
    },

    editProfileEmail() {
      if (!this.$refs.emailForm.validate()) return;

      this.$store.dispatch("editUserEmail", {
        password: this.emailPassword,
        email: this.email,
      });
    },

    editProfilePassword() {
      if (!this.$refs.passwordForm.validate()) return;

      this.$store.dispatch("editUserPassword", {
        newPassword: this.newPassword,
        oldPassword: this.oldPassword,
      });
    },

    emailPasswordOperation(v) {
      return this.emailPassword ? !!v || "Proszę podać hasło!" : true;
    },

    passwordOperation(v) {
      return this.newPassword ? !!v || "Proszę podać stare hasło!" : true;
    },

    checkConfirmPassword(v) {
      return v === this.newPassword || "Hasła muszą być identyczne!";
    },

    newPasswordOperation(v) {
      return this.oldPassword ? !!v || "Proszę podać nowe hasło!" : true;
    },
  },

  computed: {
    user() {
      return this.$store.getters.user;
    },
    activePhoto() {
      return this.file == null
        ? this.user.imageURL
        : URL.createObjectURL(this.file);
    },
  },
};
</script>

<style>
.profile .back-container {
  top: 0;
}
.home-container.profile {
  /*overflow-y: scroll;*/
}
.profile-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin: auto;
}

.avatar-placeholder {
  color: white;
  font-size: 64px;
  background-color: #804600;
}
</style>
