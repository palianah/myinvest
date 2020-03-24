import Vue from 'vue'
import Vuex from 'vuex'
import { filter } from 'lodash'
import AuthService from '@/services/auth.service'
import DataService from '@/services/data.service'
import router from '@/router'
import utilsFormat from '@/utils/formatting'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    layout: 'landing',
    idToken: null,
    userId: null,
    financeGroups: [
      {
        title: 'P2P',
        description: 'Peer-to-Peer-Lending',
      },
      {
        title: 'ETF',
        description: 'Exchange traded fund',
      },
      {
        title: 'Stock',
        description:
          'Is all of the shares into which ownership of the corporation is divided',
      },
      {
        title: 'Cash',
        description: 'Is good',
      },
    ],
    financeItems: [
      {
        exposition: 'P2P',
        title: 'Mintos',
        description: 'mintos...',
        stockID: null,
        amount: null,
        averageStockPrice: null,
        totalInvested: 13500,
        currentValue: 13661,
        profit: 161,
      },
      {
        exposition: 'P2P',
        title: 'Grupeer',
        description: 'grupeer...',
        stockID: null,
        amount: null,
        averageStockPrice: null,
        totalInvested: 2450,
        currentValue: 2575,
        profit: 125,
      },
      {
        exposition: 'ETF',
        title: 'MSCI World',
        description: 'msci world...',
        stockID: 12345,
        amount: 297,
        averageStockPrice: '19.5',
        totalInvested: 5790,
        currentValue: 5250,
        profit: -540,
      },
      {
        exposition: 'Stock',
        title: 'AMD',
        description: 'amd...',
        stockID: 21345,
        amount: 350,
        averageStockPrice: '38',
        totalInvested: 13300,
        currentValue: 14890,
        profit: 1590,
      },
      {
        exposition: 'Cash',
        title: 'Bank',
        description: 'cash...',
        stockID: null,
        amount: null,
        averageStockPrice: null,
        totalInvested: 250,
        currentValue: 250,
        profit: 0,
      },
    ],
  },
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
    UPDATE_FINANCE_GROUP(state, groupData) {
      state.financeGroups.push(groupData)
      //state.financeGroups[groupData.key] = groupData
    },
    DELETE_FINANCE_GROUP(state, key) {
      state.financeGroups = state.financeGroups.filter(
        (item) => item.key !== key
      )
    },
    UPDATE_FINANCE_ITEM(state, itemData) {
      state.financeItems.push(itemData)
      // state.financeItems[itemData.key] = itemData
    },
    DELETE_FINANCE_ITEM(state, key) {
      state.financeItems = state.financeItems.filter((item) => item.key !== key)
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
        group.totalInvested = utilsFormat.formatPrice(totalInvested)
        group.currentValue = utilsFormat.formatPrice(currentValue)
        group.profit = utilsFormat.formatPrice(currentValue - totalInvested)

        return group
      })
    },
  },
  modules: {},
})
