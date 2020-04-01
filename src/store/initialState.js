const initialState = {
  authError: '',
  layout: 'landing',
  idToken: null, // expires every hour, needed for firebase requests
  refreshToken: null, // unexpired token for login
  userId: null,
  financeGroups: [],
  financeItems: [],
  forex: {}, // EUR/USD exchange ratio e.g 1.12
}

export default initialState
