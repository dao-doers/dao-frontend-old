import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

// dapp
import Browser from 'components/Browser/Browser';
import Layout from 'components/Layout/Layout';
import Modal from 'components/Modal/Modal';
import ProposalLauncher from 'components/ProposalLauncher/ProposalLauncher';

// wallets
import Web3Modal from 'web3modal';

// settings
import { defaults } from 'lib/const';
import { config } from 'config';

import 'styles/Dapp.css';

const Web3 = require('web3');

const providerOptions = {};

const INITIAL_STATE = {
  fetching: false,
  address: defaults.EMPTY,
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
  networkId: 1,
  assets: [],
  showModal: false,
  showProposalLauncher: false,
  pendingRequest: false,
  result: null,
  mobile: window.innerWidth < 768,
};

const routes = [
  {
    path: '/',
    exact: true,
  },
  {
    path: '/period/:period',
  },
  {
    path: '/dao/:dao',
  },
  {
    path: '/address/:address',
  },
  {
    path: '/address/:address/period/:period',
  },
  {
    path: '/address/:address/period/:period',
  },
  {
    path: '/proposal/:proposal',
  },
  {
    path: '/token/:token',
  },
  {
    path: '/date/:date',
  },
  {
    path: '/search/:search',
  },
];

export const ConnectedAccount = React.createContext('');

/**
 * @summary Dapp layout with routing and wallet configuration.
 */
export default class Dapp extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
      providerOptions,
    });

    this.onConnect = this.onConnect.bind(this);
    this.reset = this.reset.bind(this);
    this.resize = this.resize.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  async componentDidMount() {
    if (this.web3Modal.cachedProvider) {
      this.onConnect();
    }
    window.addEventListener('resize', this.resize);

    // modal
    window.showModal = {
      valueInternal: false,
      valueListener: function (val) {},
      set value(val) {
        this.valueInternal = val;
        this.valueListener(val);
      },
      get value() {
        return this.valueInternal;
      },
      registerListener: function (listener) {
        this.valueListener = listener;
      },
    };
    // proposal launcher
    window.showProposalLauncher = {
      valueInternal: false,
      valueListener: function (val) {},
      set value(val) {
        this.valueInternal = val;
        this.valueListener(val);
      },
      get value() {
        return this.valueInternal;
      },
      registerListener: function (listener) {
        this.valueListener = listener;
      },
    };

    const instance = this;
    window.showModal.registerListener(function (val) {
      instance.showModal(val);
      instance.showProposalLauncher(false);
    });
    window.showProposalLauncher.registerListener(function (val) {
      instance.showProposalLauncher(val);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  showModal(val) {
    this.setState({ showModal: val });
  }

  showProposalLauncher(val) {
    this.setState({ showProposalLauncher: val });
  }

  async onConnect() {
    const provider = await this.web3Modal.connect();
    await this.subscribeProvider(provider);
    const web3 = new Web3(provider);

    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];
    const networkId = await web3.eth.net.getId();

    this.setState({
      web3,
      provider,
      connected: true,
      address,
      networkId,
    });
  }

  async subscribeProvider(provider) {
    if (!provider.on) {
      return;
    }
    provider.on('close', () => {
      this.reset();
    });

    provider.on('accountsChanged', async accounts => {
      this.setState({ address: accounts[0] });
      this.render();
    });

    provider.on('chainChanged', async chainId => {
      const { web3 } = this.state;
      const networkId = await web3.eth.net.getId();
      this.setState({ chainId, networkId });
    });

    provider.on('networkChanged', async networkId => {
      const { web3 } = this.state;
      const chainId = await web3.eth.chainId();
      this.setState({ chainId, networkId });
    });
  }

  resize() {
    if (window.innerWidth < 768 && !this.state.mobile) {
      this.setState({ mobile: true });
    } else if (window.innerWidth >= 768 && this.state.mobile) {
      this.setState({ mobile: false });
    }
  }

  async reset() {
    const { web3 } = this.state;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
      console.log(`web3.isConnected(): ${web3.isConnected()}`);
    }
    this.web3Modal.clearCachedProvider();
    this.setState({ ...INITIAL_STATE });
  }

  render() {
    return (
      <>
        <Router>
          <Switch>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                children={
                  <>
                    {this.state.showModal ? (
                      <Modal visible={this.state.showModal} modal={window.modal} mode={window.modal.mode} />
                    ) : null}
                    {this.state.showProposalLauncher ? (
                      <ProposalLauncher
                        visible={this.state.showProposalLauncher}
                        accountAddress={this.state.address}
                        address={window.proposalLauncher.address}
                      />
                    ) : null}
                    <div id="dapp" className="dapp">
                      <Browser address={this.state.address} walletConnect={this.onConnect} walletReset={this.reset} />
                      <ConnectedAccount.Provider value={this.state.address}>
                        <Layout address={this.state.address} />
                      </ConnectedAccount.Provider>
                    </div>
                    {this.state.mobile || window.innerWidth < 768 ? (
                      <Layout address={this.state.address} mobileMenu={true} />
                    ) : null}
                  </>
                }
              />
            ))}
          </Switch>
        </Router>
      </>
    );
  }
}
