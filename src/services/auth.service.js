import axios from 'axios'

const auth = axios.create({
  baseURL: process.env.VUE_APP_FIREBASE_AUTH,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  register(form) {
    return auth.post(
      `/accounts:signUp?key=${process.env.VUE_APP_FIREBASE_TOKEN}`,
      {
        ...form,
        returnSecureToken: true
      }
    )
  },
  login(form) {
    return auth.post(
      `/accounts:signInWithPassword?key=${process.env.VUE_APP_FIREBASE_TOKEN}`,
      {
        ...form,
        returnSecureToken: true
      }
    )
  }
}
