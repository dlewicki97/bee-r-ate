export default {
  state: {
    loading: false,
  },
  mutations: {
    loading: (state, loading) => (state.loading = loading),
  },
  getters: {
    loading: (state) => state.loading,
  },
};
