const initialState = {
  layout: 'landing',
  idToken: null, // expires every hour, needed for firebase requests
  refreshToken: null, // unexpired token for login
  userId: null,
  financeGroups: [],
  financeItems: [],
}

export default initialState
