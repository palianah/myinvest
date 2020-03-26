const initialState = {
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
      stockID: null,
      amount: null,
      averageStockPrice: null,
      totalInvested: 250,
      currentValue: 250,
      profit: 0,
    },
  ],
}

export default initialState
