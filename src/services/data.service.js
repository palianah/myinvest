import axios from 'axios'
import store from '@/store'

const auth = axios.create({
  baseURL: process.env.VUE_APP_FIREBASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getGroups() {
    return auth.get(
      `/financeGroups.json?auth=${store.state.idToken}&orderBy="userId"&equalTo="${store.state.userId}"`
    )
  },
  addGroup(form) {
    return auth.post(`/financeGroups.json?auth=${store.state.idToken}`, form)
  },
  updateGroup(item) {
    return auth.put(
      `/financeGroups/${item.key}.json?auth=${store.state.idToken}`,
      item
    )
  },
  deleteGroup(key) {
    return auth.delete(`/financeGroups/${key}.json?auth=${store.state.idToken}`)
  },
  getItems() {
    return auth.get(
      `/financeItems.json?auth=${store.state.idToken}&orderBy="userId"&equalTo="${store.state.userId}"`
    )
  },
  addItem(form) {
    return auth.post(`/financeItems.json?auth=${store.state.idToken}`, form)
  },
  updateItem(item) {
    return auth.put(
      `/financeItems/${item.key}.json?auth=${store.state.idToken}`,
      item
    )
  },
  deleteItem(key) {
    return auth.delete(`/financeItems/${key}.json?auth=${store.state.idToken}`)
  },
}
