<template>
  <div>
    <div id="firebaseui-auth-container" />
  </div>
</template>
<script>
import '~/node_modules/firebaseui/dist/firebaseui.css'
import { GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth'
const firebaseUi = require('firebaseui')

export default {
  name: 'FirebaseUi',

  mounted () {
    const ui = new firebaseUi.auth.AuthUI(this.$fire.auth)
    const config = {
      credentialHelper: firebaseUi.auth.CredentialHelper.NONE,
      signInOptions: [GoogleAuthProvider.PROVIDER_ID, EmailAuthProvider.PROVIDER_ID],
      signInFlow: 'popup',
      tosUrl: '/tos',
      privacyPolicyUrl: '/privacy-policy',
      callbacks: {
        signInSuccessWithAuthResult: this.signInResult
      }
    }
    ui.disableAutoSignIn()
    if (this.$store.state.user && this.$store.state.user.email) {
      this.$router.push('/')
    } else {
      ui.start('#firebaseui-auth-container', config)
    }
  },
  methods: {
    signInResult () {
      window.location.href = '/'
    }
  }
}
</script>
