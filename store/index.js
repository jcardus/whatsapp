import { firestoreAction, vuexfireMutations } from 'vuexfire'

export const mutations = {
  ...vuexfireMutations,
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser }) => {
    if (authUser) {
      const {
        uid,
        email,
        emailVerified
      } = authUser
      state.user = {
        uid,
        email,
        emailVerified
      }
    }
  }
}

export const actions = {
  onAuthStateChangedAction: () => {},
  bindRooms: firestoreAction(function ({ bindFirestoreRef }) {
    return bindFirestoreRef('rooms', this.$fire.firestore.collection('15864967972'))
  })
}

export const getters = {
  rooms: state => state.rooms
}

export const state = () => ({
  user: {},
  rooms: []
})
