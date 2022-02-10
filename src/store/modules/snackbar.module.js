export default {
  state: {
    snackbar: false,
    snackbarText: "",
  },
  mutations: {
    snackbar: (state, snackbarText) => {
      state.snackbarText = snackbarText;
      state.snackbar = true;
    },
    unsetSnackbar: (state) => {
      state.snackbarText = "";
      state.snackbar = false;
    },
  },
  getters: {
    snackbar: (state) => state.snackbar,
    snackbarText: (state) => state.snackbarText,
  },
};
