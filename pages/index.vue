<template>
  <div style="height: 100%">
    <vue-advanced-chat
      height="100vh"
      :current-user-id="currentUser"
      :rooms="JSON.stringify(rooms)"
      :rooms-loaded="roomsLoaded"
      :messages="JSON.stringify(messages)"
      :messages-loaded="messagesLoaded"
      @fetch-messages="fetchMessages($event.detail[0])"
      @send-message="$store.dispatch('sendMessage', $event.detail[0])"
    />
  </div>
</template>

<script>
import { register } from 'vue-advanced-chat'
import { mapGetters } from 'vuex'
register()

export const parseTimestamp = (timestamp, format = '') => {
  if (!timestamp) { return }

  const date = timestamp.seconds
    ? new Date(timestamp.seconds * 1000)
    : timestamp

  if (format === 'HH:mm') {
    return `${zeroPad(date.getHours(), 2)}:${zeroPad(date.getMinutes(), 2)}`
  } else if (format === 'DD MMMM YYYY') {
    const options = { month: 'long', year: 'numeric', day: 'numeric' }
    return `${new Intl.DateTimeFormat('en-GB', options).format(date)}`
  } else if (format === 'DD/MM/YY') {
    const options = { month: 'numeric', year: 'numeric', day: 'numeric' }
    return `${new Intl.DateTimeFormat('en-GB', options).format(date)}`
  } else if (format === 'DD MMMM, HH:mm') {
    const options = { month: 'long', day: 'numeric' }
    return `${new Intl.DateTimeFormat('en-GB', options).format(
      date
    )}, ${zeroPad(date.getHours(), 2)}:${zeroPad(date.getMinutes(), 2)}`
  }

  return date
}

const zeroPad = (num, pad) => {
  return String(num).padStart(pad, '0')
}

export default {
  name: 'IndexPage',
  middleware: 'auth',
  data () {
    return {
      messagesLoaded: false
    }
  },
  computed: {
    ...mapGetters(['roomsLoaded', 'currentUser']),
    messages () {
      return this.$store.getters.messages.map(m => ({
        content: m.text && m.text.body,
        _id: m.id.replace('wamid.', '').replace(/=/g, ''),
        senderId: m.from,
        timestamp: parseTimestamp(new Date(m.timestamp * 1000), 'HH:mm'),
        date: parseTimestamp(new Date(m.timestamp * 1000), 'DD MMMM YYYY'),
        ...(m.image || m.audio
          ? {
              files: [
                {
                  audio: m.audio && m.audio.voice,
                  type: (m.image || m.audio).mime_type && (m.image || m.audio).mime_type.split(';')[0],
                  url: (m.image || m.audio).link || `${process.env.CLOUDFRONT_URL}/${(m.image || m.audio).id}`
                }
              ]
            }
          : {})
      }))
    },
    rooms () {
      return this.$store.getters.rooms.map((r) => {
        return {
          roomName: r.name,
          lastMessage: {
            content: r.wa_id
          },
          avatar: 'https://ui-avatars.com/api/?name=' + r.name,
          roomId: r.wa_id,
          users: [
            { _id: r.wa_id, username: r.name },
            { _id: this.currentUser, username: this.currentUser }
          ]
        }
      })
    }
  },
  created () {
    this.$store.dispatch('bindRooms')
  },
  methods: {
    async fetchMessages ({ room/*, options = {} */ }) {
      this.messages = []
      await this.$store.dispatch('unbindMessages')
      await this.$store.dispatch('bindMessages', room.roomId)
      this.messagesLoaded = true
      // await this.$store.dispatch('clearUnread', room.roomId)
    }
  }
}
</script>
