import axios from 'axios'

const finance = axios.create({
  baseURL: process.env.VUE_APP_TWELVE_DATA_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  quote(symbol) {
    return finance.get(
      `/quote?symbol=${symbol}&apikey=${process.env.VUE_APP_TWELVE_DATA_KEY}`
    )
  },
  forex(symbol = 'EUR/USD') {
    return finance.get(
      `/price?symbol=${symbol}&apikey=${process.env.VUE_APP_TWELVE_DATA_KEY}`
    )
  },
}
