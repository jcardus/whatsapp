<template>
  <div style="height: 100%; padding: 20px;">
    <div>
      {{ $store.state.user && $store.state.user.email }}
      <p />
    </div>
    <vue-advanced-chat
      :current-user-id="currentUserId"
      :rooms="JSON.stringify(rooms)"
      :messages="JSON.stringify(messages)"
    />
  </div>
</template>

<script>
import { register } from 'vue-advanced-chat'
register()
export default {
  name: 'IndexPage',
  middleware: 'auth',
  data () {
    return {
      currentUserId: '1234',
      messages: []
    }
  },
  computed: {
    rooms () {
      return this.$store.getters.rooms.map((r) => {
        return {
          roomName: r.name,
          avatar: 'https://ui-avatars.com/api/?name=' + r.name,
          unreadCount: 1,
          roomId: r.id || r.name,
          users: [
            { _id: r.id, username: r.name },
            { _id: 'asdasd', username: 'asdasd' }
          ]
        }
      })
    }
  },
  created () {
    this.$store.dispatch('bindRooms')
  }
}
</script>
