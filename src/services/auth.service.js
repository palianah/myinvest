import axios from 'axios'

const auth = axios.create({
  baseURL: process.env.VUE_APP_FIREBASE_AUTH,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

const refreshAuth = axios.create({
  baseURL: `https://securetoken.googleapis.com/v1`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  register(form) {
    return auth.post(
      `/accounts:signUp?key=${process.env.VUE_APP_FIREBASE_TOKEN}`,
      {
        ...form,
        returnSecureToken: true,
      }
    )
  },
  login(form) {
    return auth.post(
      `/accounts:signInWithPassword?key=${process.env.VUE_APP_FIREBASE_TOKEN}`,
      {
        ...form,
        returnSecureToken: true,
      }
    )
  },
  refreshIdToken(refreshToken) {
    return refreshAuth.post(
      `/token?key=${process.env.VUE_APP_FIREBASE_TOKEN}`,
      {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }
    )
  },
}
