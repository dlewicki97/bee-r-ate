export default {
  beforeMount() {
    this.$store.commit("beers", []);
  },

  methods: {
    searchBeers() {
      this.$store.dispatch("searchBeers", this.search);
    },
  },

  computed: {
    beersAreLoading: function () {
      return this.$store.getters.beersAreLoading;
    },
  },
};
