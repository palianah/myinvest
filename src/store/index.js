import Vue from 'vue'
import Vuex from 'vuex'
import { filter, findIndex } from 'lodash'
import AuthService from '@/services/auth.service'
import DataService from '@/services/data.service'
import router from '@/router'
import initialState from '@/store/initialState'

Vue.use(Vuex)

export default new Vuex.Store({
  state: initialState,
  mutations: {
    SET_LAYOUT(state, layout) {
      state.layout = layout
    },
    AUTH_USER(state, userData) {
      state.idToken = userData.token
      state.userId = userData.userId
    },
    CLEAR_AUTH_DATA(state) {
      state.idToken = null
      state.userId = null
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
    },
    ADD_FINANCE_GROUP(state, groupData) {
      state.financeGroups.push(groupData)
    },
    UPDATE_FINANCE_GROUP(state, groupData) {
      const index = findIndex(state.financeGroups, { title: groupData.title }) // TODO: change with key!
      // need to overwrite in a new array because it is not updated if i just change the item itself!
      const newData = [...state.financeGroups]
      newData[index] = groupData
      state.financeGroups = newData
    },
    DELETE_FINANCE_GROUP(state, title) {
      // TODO: delete with key and userId match
      state.financeGroups = state.financeGroups.filter(
        (item) => item.title !== title
      )
    },
    ADD_FINANCE_ITEM(state, itemData) {
      // TODO: check if itemData.title exists already, if yes, merge values!
      state.financeItems.push(itemData)
    },
    UPDATE_FINANCE_ITEM(state, itemData) {
      const index = findIndex(state.financeItems, { title: itemData.title }) // TODO: change with key!
      // need to overwrite in a new array because it is not updated if i just change the item itself!
      const newData = [...state.financeItems]
      newData[index] = itemData
      state.financeItems = newData
    },
    DELETE_FINANCE_ITEM(state, title) {
      // TODO: delete with key and userId match
      state.financeItems = state.financeItems.filter(
        (item) => item.title !== title
      )
    },
  },
  actions: {
    signup({ commit }, authData) {
      AuthService.register({
        email: authData.email,
        password: authData.password,
      })
        .then((res) => {
          commit('AUTH_USER', {
            token: res.data.refreshToken, // idToken
            userId: res.data.localId,
          })
          commit('SET_LAYOUT', 'default')
          localStorage.setItem('token', res.data.refreshToken)
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
            token: res.data.refreshToken, // idToken
            userId: res.data.localId,
          })
          commit('SET_LAYOUT', 'default')
          localStorage.setItem('token', res.data.refreshToken)
          localStorage.setItem('userId', res.data.localId)
          router.push({ name: 'dashboard' })
        })
        .catch((e) => console.error(e))
    },
    tryAutoLogin({ commit }) {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      if (!token || !userId) {
        return
      }
      commit('AUTH_USER', { token, userId })
      commit('SET_LAYOUT', 'default')
    },
    logout({ commit }) {
      commit('CLEAR_AUTH_DATA')
      commit('SET_LAYOUT', 'landing')
      router.replace({ name: 'home' })
    },
    // e.g P2P, Aktien, ETF
    addFinanceGroup({ state, commit }, formData) {
      // TODO: use ...formData and add only uid
      DataService.addGroup({
        uid: state.userId,
        title: formData.title,
        description: formData.description,
      })
        .then((res) => {
          commit('ADD_FINANCE_GROUP', { ...res.data }) // , key: res.data.key
        })
        .catch((e) => console.error(e))
    },
    // e.g AMD, Mintos, Bondora, Apple, MSCI World ETF
    addFinanceItem({ state, commit }, formData) {
      // TODO: use ...formData and add only uid
      DataService.addItem({
        uid: state.userId,
        exposition: formData.exposition,
        title: formData.title,
        description: formData.description,
        stockID: formData.stockID, // e.g to connect to investing.com apple id?
      })
        .then((res) => {
          commit('ADD_FINANCE_ITEM', { ...res.data }) // , key: res.data.key
        })
        .catch((e) => console.error(e))
    },
    // Buy Stock, amount, price
    buyFinanceItem({ state, commit }, formData) {
      DataService.buyItem({
        uid: state.userId,
        amount: formData.amount,
        averageStockPrice: formData.stockPrice,
        totalPrice: formData.totalPrice, // single stock price * amount
      })
        .then((res) => {
          commit('UPDATE_FINANCE_ITEM', { ...res.data })
        })
        .catch((e) => console.error(e))
    },
    // deleteFinanceItem({ state, commit }, formData) {
    //   DataService.updateItem({
    //     uid: state.userId,
    //     item: formData.item,
    //     amount: formData.amount,
    //     purchasePrice: formData.purchasePrice,
    //     fee: formData.fee,
    //     totalPrice: formData.totalPrice // single stock price * amount - fee
    //   })
    //     .then(res => {
    //       commit('UPDATE_FINANCE_ITEM', { ...res.data })
    //     })
    //     .catch(e => console.error(e))
    // }
  },
  getters: {
    groupNames: (state) => {
      if (!state.financeGroups) return ''
      const groupNames = []
      state.financeGroups.forEach((group, index) => {
        groupNames[index] = group.title
      })
      return groupNames
    },
    // adds to the finance groups the totalInvested and current value and profit properties
    groupsWithInvestments: (state) => {
      if (!state.financeGroups.length || !state.financeItems.length) return

      return state.financeGroups.map((group) => {
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
      if (!getters.groupsWithInvestments) return
      let value = 0
      getters.groupsWithInvestments.forEach((invest) => {
        value += parseFloat(invest.currentValue)
      })
      return value
    },
  },
  modules: {},
})
