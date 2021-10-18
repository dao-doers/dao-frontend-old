export const config = {
  web: {
    explorer: 'https://etherscan.io',
    icons: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/{{publicAddress}}/logo.png'
  },
  graph: {
    tokens: 'https://api.thegraph.com/subgraphs/name/protofire/token-registry',
    moloch: 'http://144.126.223.15:8000/subgraphs/name/odyssy-automaton/daohaus',
    ens: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
  },
  keys: {
    fortmatic: 'pk_live_0826872BC201129A'
  },
  component: {
    toggle: {
      checkedIcon: false,
      uncheckedIcon: false,
      height: 20,
      width: 42,
      onColor: '#01c190',
      activeBoxShadow: ''
    }
  }
}
