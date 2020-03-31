import Vue from 'vue'
import Vuex from 'vuex'
import { filter, findIndex } from 'lodash'
import AuthService from '@/services/auth.service'
import DataService from '@/services/data.service'
import FinanceService from '@/services/finance.service'
import router from '@/router'
import initialState from '@/store/initialState'
import utilsTimer from '@/utils/timer'

Vue.use(Vuex)

export default new Vuex.Store({
  state: initialState,
  mutations: {
    SET_LAYOUT(state, layout) {
      state.layout = layout
    },
    AUTH_USER(state, userData) {
      state.idToken = userData.token
      state.refreshToken = userData.refreshToken
      state.userId = userData.userId
    },
    CLEAR_AUTH_DATA(state) {
      state.idToken = null
      state.refreshToken = null
      state.userId = null
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('expirationDate')
    },
    ADD_FINANCE_GROUP(state, groupData) {
      if (groupData.multiple) {
        Object.entries(groupData).forEach((group) => {
          if (group[0] !== 'multiple') {
            state.financeGroups.push({
              ...group[1],
              key: group[0],
            })
          }
        })
      } else {
        state.financeGroups.push(groupData)
      }
    },
    UPDATE_FINANCE_GROUP(state, groupData) {
      const index = findIndex(state.financeGroups, { key: groupData.key })
      // need to overwrite in a new array because it is not updated if i just change the item itself!
      const newData = [...state.financeGroups]
      newData[index] = groupData
      state.financeGroups = newData
    },
    DELETE_FINANCE_GROUP(state, key) {
      state.financeGroups = state.financeGroups.filter(
        (item) => item.key !== key
      )
    },
    ADD_FINANCE_ITEM(state, itemData) {
      // TODO: check if itemData.title exists already, if yes, merge values!
      if (itemData.multiple) {
        Object.entries(itemData).forEach((item) => {
          if (item[0] !== 'multiple') {
            state.financeItems.push({
              ...item[1],
              key: item[0],
            })
          }
        })
      } else {
        state.financeItems.push(itemData)
      }
    },
    UPDATE_FINANCE_ITEM(state, itemData) {
      const index = findIndex(state.financeItems, { key: itemData.key })
      // need to overwrite in a new array because it is not updated if i just change the item itself!
      const newData = [...state.financeItems]
      newData[index] = itemData
      state.financeItems = newData
    },
    DELETE_FINANCE_ITEM(state, key) {
      state.financeItems = state.financeItems.filter((item) => item.key !== key)
    },
    UPDATE_FOREX(state, value) {
      state.forex = value
    },
  },
  actions: {
    setLogoutTimer({ commit }, expirationTime) {
      setTimeout(() => {
        commit('CLEAR_AUTH_DATA')
      }, expirationTime) // * 1000
    },
    signup({ commit }, authData) {
      AuthService.register({
        email: authData.email,
        password: authData.password,
      })
        .then((res) => {
          commit('AUTH_USER', {
            refreshToken: res.data.refreshToken,
            token: res.data.idToken,
            userId: res.data.localId,
          })
          commit('SET_LAYOUT', 'default')
          const expirationDate = utilsTimer.addMinutes(new Date(), 55) // 55min
          localStorage.setItem('expirationDate', expirationDate)
          localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('refreshToken', res.data.refreshToken)
          localStorage.setItem('userId', res.data.localId)
          router.push({ name: 'dashboard' })
        })
        .catch((e) => console.error(e))
    },
    login({ commit }, authData) {
      AuthService.login({
        email: authData.email,
        password: authData.password,
      })
        .then((res) => {
          commit('AUTH_USER', {
            refreshToken: res.data.refreshToken,
            token: res.data.idToken,
            userId: res.data.localId,
          })
          commit('SET_LAYOUT', 'default')

          const expirationDate = utilsTimer.addMinutes(new Date(), 55) // 55min
          localStorage.setItem('expirationDate', expirationDate)
          localStorage.setItem('refreshToken', res.data.refreshToken)
          localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          router.push({ name: 'dashboard' })
        })
        .catch((e) => console.error(e))
    },
    tryAutoLogin({ dispatch, commit }) {
      const refreshToken = localStorage.getItem('refreshToken')
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')

      if (!token || !userId) {
        return
      }

      const expirationDate = Date.parse(localStorage.getItem('expirationDate'))
      if (new Date().getTime() >= expirationDate) {
        dispatch('refreshIdToken', refreshToken)
      }

      commit('AUTH_USER', { refreshToken, userId, token })
      commit('SET_LAYOUT', 'default')
    },
    logout({ commit }) {
      commit('CLEAR_AUTH_DATA')
      commit('SET_LAYOUT', 'landing')
      router.replace({ name: 'home' })
    },
    refreshIdToken({ state, commit }, refreshToken) {
      AuthService.refreshIdToken(refreshToken)
        .then((res) => {
          commit('AUTH_USER', {
            refreshToken: state.refreshToken,
            userId: state.userId,
            token: res.data.id_token,
          })

          const expirationDate = utilsTimer.addMinutes(new Date(), 55) // 55min
          localStorage.setItem('expirationDate', expirationDate)
          localStorage.setItem('token', res.data.id_token)
        })
        .catch((e) => console.error(e))
    },
    addFinanceGroup({ state, commit }, formData) {
      DataService.addGroup({
        ...formData,
        userId: state.userId,
      })
        .then((res) => {
          commit('ADD_FINANCE_GROUP', {
            ...formData,
            userId: state.userId,
            key: res.data.name,
          })
        })
        .catch((e) => console.error(e))
    },
    updateFinanceGroup({ state, commit }, formData) {
      DataService.updateGroup({
        ...formData,
        userId: state.userId,
      })
        .then(() => {
          commit('UPDATE_FINANCE_GROUP', {
            ...formData,
            userId: state.userId,
          })
        })
        .catch((e) => console.error(e))
    },
    getFinanceGroups({ commit }) {
      DataService.getGroups()
        .then((res) => {
          commit('ADD_FINANCE_GROUP', { ...res.data, multiple: true })
        })
        .catch((e) => console.error(e))
    },
    deleteFinanceGroup({ state, dispatch, commit }, item) {
      DataService.deleteGroup(item.key)
        .then(() => {
          commit('DELETE_FINANCE_GROUP', item.key)
          // delete all items from this group
          state.financeItems.forEach((item) => {
            if (item.exposition === item.title) {
              dispatch('deleteFinanceItem', item.key)
            }
          })
        })
        .catch((e) => console.error(e))
    },
    addFinanceItem({ state, commit }, formData) {
      DataService.addItem({
        ...formData,
        userId: state.userId,
      })
        .then((res) => {
          commit('ADD_FINANCE_ITEM', {
            ...formData,
            userId: state.userId,
            key: res.data.name,
          })
        })
        .catch((e) => console.error(e))
    },
    updateFinanceItem({ state, commit }, formData) {
      DataService.updateItem({
        ...formData,
        userId: state.userId,
      })
        .then(() => {
          commit('UPDATE_FINANCE_ITEM', {
            ...formData,
            userId: state.userId,
          })
        })
        .catch((e) => console.error(e))
    },
    getFinanceItems({ commit }) {
      DataService.getItems()
        .then((res) => {
          commit('ADD_FINANCE_ITEM', { ...res.data, multiple: true })
        })
        .catch((e) => console.error(e))
    },
    buyFinanceItem({ state, commit }, formData) {
      DataService.buyItem({
        ...formData,
        uid: state.userId,
      })
        .then((res) => {
          commit('UPDATE_FINANCE_ITEM', { ...res.data })
        })
        .catch((e) => console.error(e))
    },
    deleteFinanceItem({ commit }, key) {
      DataService.deleteItem(key)
        .then(() => {
          commit('DELETE_FINANCE_ITEM', key)
        })
        .catch((e) => console.error(e))
    },
    convertExchange({ commit }, symbol) {
      FinanceService.forex(symbol).then((res) => {
        commit('UPDATE_FOREX', {
          key: symbol,
          value: parseFloat(res.data.price),
        })
      })
    },
    realStockPrice({ state }, item) {
      if (!state.forex || !state.forex.value) return 0

      return FinanceService.quote(item.stockID)
        .then((res) => {
          const price = parseFloat(res.data.close)
          const dif = parseFloat(state.forex.value)
          let real_price = price.toFixed(2)

          if (item.market === 'US') {
            // TODO: check language and global currency in future!
            real_price = parseFloat(price / dif).toFixed(2)
          }

          return {
            ...res.data,
            real_price: parseFloat(real_price),
          }
        })
        .catch((e) => console.error(e))
    },
  },
  getters: {
    groupNames: (state) => {
      if (!state.financeGroups) return []
      // sort highest val to lowest
      const sortedGroups = state.financeGroups.sort(
        (a, b) => b.totalInvested - a.totalInvested
      )
      const groupNames = []
      sortedGroups.forEach((group, index) => {
        groupNames[index] = group.title
      })
      return groupNames
    },
    sortedItemsByPrice: (state) => {
      if (!state.financeItems.length) return []

      const sortedItems = state.financeItems.sort((a, b) => {
        return parseFloat(b.totalInvested) - parseFloat(a.totalInvested)
      })
      return sortedItems
    },
    groupPercentValues: (_, getters) => {
      if (!getters.filteredGroups || !getters.totalCapitalAsset) return []
      const total = getters.totalCapitalAsset
      const groupValues = []
      getters.filteredGroups.forEach((item, index) => {
        const value = ((parseFloat(item.currentValue) / total) * 100).toFixed(2)
        groupValues[index] = parseFloat(value)
      })

      // sort highest to lowest
      return groupValues.sort((a, b) => b - a)
    },
    // adds to the finance groups the totalInvested and current value and profit properties
    filteredGroups: (state) => {
      if (!state.financeGroups.length) return []

      return state.financeGroups.filter((group) => {
        const expos = filter(state.financeItems, { exposition: group.title })
        let totalInvested = 0
        let currentValue = 0
        if (expos.length) {
          expos.forEach((sub) => {
            totalInvested += parseFloat(sub.totalInvested)
            currentValue += parseFloat(sub.currentValue)
          })
        }
        group.totalInvested = totalInvested
        group.currentValue = currentValue
        group.profit = currentValue - totalInvested
        return group
      })
    },
    totalCapitalAsset: (_, getters) => {
      if (!getters.filteredGroups) return 0
      let value = 0
      getters.filteredGroups.forEach((invest) => {
        value += parseFloat(invest.currentValue)
      })
      return value
    },
  },
  modules: {},
})
