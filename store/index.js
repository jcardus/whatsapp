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
const root = '15864967972'

export const actions = {
  bindMessages: firestoreAction(function ({ bindFirestoreRef }, roomId) {
    return bindFirestoreRef('messages',
      this.$fire.firestore.collection(`${root}/${roomId}/messages`).orderBy('timestamp'))
  }),
  unbindMessages: firestoreAction(({ unbindFirestoreRef }) => {
    unbindFirestoreRef('messages')
  }),
  onAuthStateChangedAction: () => {},
  bindRooms: firestoreAction(function ({ bindFirestoreRef }) {
    return bindFirestoreRef('rooms', this.$fire.firestore.collection(root))
  }),
  async sendMessage (context, message) {
    const data = {
      messaging_product: 'whatsapp',
      from: root,
      to: message.roomId,
      type: 'text',
      text: {
        body: message.content
      },
      timestamp: new Date().getTime().toString().substring(0, 10)
    }
    const { messages } = await this.$axios.$post('/', data)
    return this.$fire.firestore
      .collection(`${root}/${message.roomId}/messages`)
      .doc(messages[0].id)
      .set({ ...data, id: messages[0].id })
  }
}

export const getters = {
  currentUser: () => root,
  rooms: state => state.rooms,
  messages: state => state.messages,
  roomsLoaded: state => state.rooms.length !== 0
}

export const state = () => ({
  user: {},
  rooms: [],
  messages: []
})
