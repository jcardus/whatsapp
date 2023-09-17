export default function ({ app, store }) {
  if (app.$fire.auth) {
    if (store.state.user && !store.state.user.email) {
      app.router.push('/login')
    }
    // If user is logged in, store.state.authUser will be filled.
    // INFO -> Firebase Services can be accessed with app.$fire.auth (etc.) in Middleware.
  }
}
