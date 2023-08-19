import { GoogleAuthProvider } from 'firebase/auth'
export default function ({ app, store }) {
  if (app.$fire.auth) {
    if (store.state.user && !store.state.user.email) {
      app.$fire.auth.signInWithPopup(new GoogleAuthProvider())
    }
    // If user is logged in, store.state.authUser will be filled.
    // INFO -> Firebase Services can be accessed with app.$fire.auth (etc.) in Middleware.
  }
}
