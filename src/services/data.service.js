import axios from 'axios'

const auth = axios.create({
  baseURL: process.env.VUE_APP_FIREBASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  getGroups() {
    return auth.get(
      `/financeGroups.json?key=${process.env.VUE_APP_FIREBASE_TOKEN}`
    )
  },
  addGroup(form) {
    return auth.post(
      `/financeGroups.json?key=${process.env.VUE_APP_FIREBASE_TOKEN}`,
      form
    )
  },
  updateGroup(form) {
    return auth.put(
      `/financeGroups.json?key=${process.env.VUE_APP_FIREBASE_TOKEN}`,
      form
    )
  },
  deleteGroup(key) {
    return auth.delete(
      `/financeGroups.json?key=${process.env.VUE_APP_FIREBASE_TOKEN}`,
      key
    )
  },
  getItems() {
    return auth.get(
      `/financeItems.json?key=${process.env.VUE_APP_FIREBASE_TOKEN}`
    )
  },
  addItem(form) {
    return auth.post(
      `/financeItems.json?key=${process.env.VUE_APP_FIREBASE_TOKEN}`,
      form
    )
  },
  editItem(form) {
    return auth.put(
      `/financeItems.json?key=${process.env.VUE_APP_FIREBASE_TOKEN}`,
      form
    )
  },
  deleteItem(key) {
    return auth.delete(
      `/financeItems.json?key=${process.env.VUE_APP_FIREBASE_TOKEN}`,
      key
    )
  }
}
