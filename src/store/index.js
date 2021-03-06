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
      state.authError = ''
    },
    AUTH_MESSAGE(state, target) {
      state.authError = target
    },
    CLEAR_DATA(state) {
      state.idToken = null
      state.refreshToken = null
      state.userId = null
      state.authError = ''
      state.financeGroups = []
      state.financeItems = []
      state.forex = {}
      state.showTour = null
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('expirationDate')
    },
    SHOW_TOUR(state, tour) {
      state.showTour = tour
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
        commit('CLEAR_DATA')
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
        .catch((e) => {
          console.error('error signup: ', e)
          commit('AUTH_MESSAGE', 'register')
        })
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
        .catch((e) => {
          console.error('error login: ', e)
          commit('AUTH_MESSAGE', 'login')
        })
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
      } else {
        commit('AUTH_USER', { refreshToken, userId, token })
      }
      commit('SET_LAYOUT', 'default')
    },
    logout({ commit }) {
      commit('CLEAR_DATA')
      commit('SET_LAYOUT', 'landing')
      router.replace({ name: 'login' })
    },
    refreshIdToken({ commit }, refreshToken) {
      const userId = localStorage.getItem('userId')

      AuthService.refreshIdToken(refreshToken)
        .then((res) => {
          commit('AUTH_USER', {
            refreshToken,
            userId,
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
    getFinanceGroups({ commit, state }) {
      if (!state.userId) return []
      const expirationDate = Date.parse(localStorage.getItem('expirationDate'))
      if (new Date().getTime() >= expirationDate) {
        location.reload()
      } else {
        DataService.getGroups()
          .then((res) => {
            if (Object.keys(res.data).length) {
              commit('SHOW_TOUR', false)
              commit('ADD_FINANCE_GROUP', { ...res.data, multiple: true })
            } else {
              commit('SHOW_TOUR', true)
            }
          })
          .catch((e) => console.error(e))
      }
    },
    deleteFinanceGroup({ state, dispatch, commit }, group) {
      DataService.deleteGroup(group.key)
        .then(() => {
          commit('DELETE_FINANCE_GROUP', group.key)
          // delete all items from this group
          state.financeItems.forEach((item) => {
            if (group.key === item.exposition.value) {
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
    getFinanceItems({ commit, state, dispatch }) {
      if (!state.userId) return []

      // check expireDate if expired, refresh token!
      const expirationDate = Date.parse(localStorage.getItem('expirationDate'))
      if (new Date().getTime() >= expirationDate) {
        return
      } else {
        DataService.getItems()
          .then((res) => {
            if (Object.keys(res.data).length) {
              commit('ADD_FINANCE_ITEM', { ...res.data, multiple: true })
            } else {
              // if no item found, dispatch..
              dispatch('convertExchange', 'EUR/USD')
            }
          })
          .catch((e) => console.error(e))
      }
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
      FinanceService.forex(symbol)
        .then((res) => {
          commit('UPDATE_FOREX', {
            key: symbol,
            value: parseFloat(res.data.price),
          })
        })
        .catch((e) => console.error('convertExchange error: ', e))
    },
    realStockPrice({ state }, items) {
      if (!state.forex || !state.forex.value) return 0

      const stockIDs = []
      items.forEach((item, i) => {
        stockIDs[i] = item.stockID
      })

      return FinanceService.quote(stockIDs.join(','))
        .then((res) => {
          const { data } = res
          let price = 0
          const dif = parseFloat(state.forex.value)
          let real_price = 0
          const multipleData = []
          if (items.length > 1) {
            // multiple
            Object.values(data).forEach((entry, i) => {
              price = parseFloat(entry.close)
              real_price = price.toFixed(2)
              // TODO: check language and global currency in future!
              if (items[i].market === 'US') {
                real_price = parseFloat(price / dif).toFixed(2)
              }
              multipleData[i] = { ...entry, real_price: parseFloat(real_price) }
            })
          } else {
            // single
            price = parseFloat(data.close)
            real_price = price.toFixed(2)
            // TODO: check language and global currency in future!
            if (items[0].market === 'US') {
              real_price = parseFloat(price / dif).toFixed(2)
            }

            return {
              ...data,
              real_price: parseFloat(real_price),
            }
          }

          return {
            ...multipleData,
          }
        })
        .catch((e) => console.error('realStockPrice: ', e))
    },
  },
  getters: {
    allGroups: (state, getters) => {
      if (!state.financeGroups.length || !getters.sortedGroups.length) return []

      const allGroups = []
      getters.sortedGroups.forEach((group, index) => {
        allGroups[index] = {
          title: group.title,
          value: group.key,
          groupType: group.groupType,
        }
      })
      return allGroups
    },
    sortedItemsByPrice: (state) => {
      if (!state.financeItems.length) return []

      const sortedItems = state.financeItems.sort((a, b) => {
        return parseFloat(b.currentValue) - parseFloat(a.currentValue)
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
    sortedGroups: (state) => {
      if (!state.financeGroups.length) return []
      // sort highest val to lowest
      return state.financeGroups.sort((a, b) => b.currentValue - a.currentValue)
    },
    // adds to the finance groups the totalInvested and current value and profit properties
    filteredGroups: (state, getters) => {
      if (!state.financeGroups.length || !getters.sortedGroups.length) return []

      return getters.sortedGroups.filter((group) => {
        const expos = filter(state.financeItems, (g) => {
          return g.exposition.value === group.key
        })
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
    totalInvested: (_, getters) => {
      if (!getters.filteredGroups) return 0
      let value = 0
      getters.filteredGroups.forEach((invest) => {
        value += parseFloat(invest.totalInvested)
      })
      return value
    },
    totalProfit: (_, getters) => {
      if (!getters.filteredGroups) return 0
      let value = 0
      getters.filteredGroups.forEach((invest) => {
        value += parseFloat(invest.profit)
      })
      return value
    },
  },
  modules: {},
})
