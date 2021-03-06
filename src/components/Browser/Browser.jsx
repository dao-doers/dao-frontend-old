import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { defaults } from 'lib/const';
import { withRouter } from 'react-router-dom';

import Account from 'components/Account/Account';
import DAO from 'components/DAO/DAO';
import Timeline from 'components/Timeline/Timeline';

import { view as routerView } from 'lib/const';
import signout from 'images/signout.svg';
import logo from 'images/logo.png';

import i18n from 'i18n';
import 'styles/Dapp.css';
import DBadge from 'components/DBadge/DBadge';
import ApolloClient, { gql, InMemoryCache } from 'apollo-boost';
import { config } from '../../config';
import { getBlockNumber } from 'components/ProposalLauncher/utils';
import BigNumber from 'bignumber.js/bignumber';

// scroll settings
let lastScrollTop = 0;

const molochClient = new ApolloClient({
  uri: config.graph.moloch,
  cache: new InMemoryCache(),
});

const _openBurger = () => {
  const dapp = document.getElementById('dapp');
  const burger = document.getElementById('burger');
  const cover = document.getElementById('cover');
  if (dapp) {
    dapp.classList.remove('dapp-closed');
    dapp.classList.add('dapp-sidebar');
    if (burger) {
      burger.classList.add('burger-menu-open');
      burger.classList.remove('burger-menu-close');
      if (cover) {
        cover.classList.add('cover-open');
        cover.classList.remove('cover-close');
      }
    }
  }
};

const _closeBurger = () => {
  const dapp = document.getElementById('dapp');
  const burger = document.getElementById('burger');
  const cover = document.getElementById('cover');
  if (dapp) {
    dapp.classList.remove('dapp-sidebar');
    dapp.classList.add('dapp-closed');
    if (burger) {
      burger.classList.add('burger-menu-close');
      burger.classList.remove('burger-menu-open');
      if (cover) {
        cover.classList.add('cover-close');
        cover.classList.remove('cover-open');
      }
    }
  }
};

/**
 * @summary displays the contents of a poll
 */
class Browser extends Component {
  setLatestBlock = () => {
    return molochClient
      .query({
        query: gql`{
          _meta {
            block {
              number
            }
          }
        }`,
      })
      .then(res =>
        this.setState({
          blockNumber: res.data._meta.block.number,
          isLoading: res.loading,
          isError: res.errors
        }))
      .catch(err => console.error('DAOs subgraph not available: ', err));
  };

  setLatestBlockFromLayer2 = () => {
    return getBlockNumber
      .then(res =>
        this.setState({
          blockNumberLayer2: res,
          isLoadingFromLayer2: true
        }),)
      .catch(err => console.error('Nervos Layer 2 not available: ', err));
  };

  constructor(props) {
    super(props);

    this.state = {
      node: document.getElementById('browser'),
      mobileSidebar: false,
      scrollUp: false,
      blockNumber: 0,
      blockNumberLayer2: 0,
      isLoading: false,
      isLoadingFromLayer2: false,
      isError: false
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    document.getElementById('dapp').addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    document.getElementById('dapp').removeEventListener('scroll', this.handleScroll);
  }

  getScrollClass() {
    if (this.state.scrollUp) {
      return 'hero-navbar topbar hero-navbar-scroller hero-navbar-up';
    }
    return 'hero-navbar topbar hero-navbar-scroller hero-navbar-down';
  }

  handleScroll() {
    const st = document.getElementById('dapp').scrollTop;

    if (
      document.getElementById('alternative-feed').style.minHeight !==
      `${document.getElementById('proposals').scrollHeight}px`
    ) {
      document.getElementById('alternative-feed').style.minHeight = `${
        document.getElementById('proposals').scrollHeight
      }px`;
    }
    if (st > lastScrollTop && st > 60 && !this.state.scrollUp) {
      this.setState({ scrollUp: true });
    } else if (st <= lastScrollTop && this.state.scrollUp) {
      this.setState({ scrollUp: false });
    }
    lastScrollTop = st <= 0 ? 0 : st;
  }

  handleClick() {
    if (window.innerWidth < 768) {
      if (!this.state.mobileSidebar) {
        _openBurger();
      } else {
        _closeBurger();
      }
      this.setState({ mobileSidebar: !this.state.mobileSidebar });
    } else {
      this.props.history.push('/');
    }
  }

  connectedWallet() {
    return this.props.address !== defaults.EMPTY;
  }

  componentDidMount() {
    this.setLatestBlock()
    this.setLatestBlockFromLayer2()
  }

  render() {
    const {
      isError,
      blockNumber,
      blockNumberLayer2,
      isLoading,
      isLoadingFromLayer2,
    } = this.state;
    return (
      <>
        <div id="browser" className={this.getScrollClass()}>
          <div className="topbar-max">
            <div className="hero-home-button-wrapper">
              <div style={{ pointerEvents: 'none' }} id="nav-home" className="hero-home-button">
                <img className="hero-logo" alt="" src={logo} onClick={this.handleClick} />
              </div>
              {!isError ?
                blockNumber < blockNumberLayer2 ? 
                <DBadge
                  badgeColor="var(--menu-sidebar-selected)"
                  borderColor="var(--main-headline-color)"
                  badgeContent={isLoading && isLoadingFromLayer2 ? `indexer status: ${new BigNumber(blockNumberLayer2).minus(blockNumber)} blocks behind` : 'loading indexer status ..'}
                  variant="standard"
                >
                  <span className="hero-home-text">Nervos Community DAO</span>
                </DBadge> 
                : 
                <DBadge
                  badgeColor="var(--menu-sidebar-selected)"
                  borderColor="var(--main-headline-color)"
                  badgeContent={`indexer status: OK`}
                  variant="standard"
                >
                  <span className="hero-home-text">Nervos Community DAO</span>
                </DBadge>
                :
                <DBadge
                  badgeColor="var(--negative-signal-color)"
                  borderColor="var(--negative-signal-color)"
                  badgeContent={`indexer status: Error`}
                  variant="standard"
                >
                  <span className="hero-home-text">Nervos Community DAO</span>
                </DBadge>
              }
            </div>
            {this.connectedWallet() ? (
              <div className="hero-button hero-button-mobile hero-signin">
                <button
                  id="sign-out-button"
                  className="hero-menu-link hero-menu-link-signin-simple hero-menu-link-signin-simple-icon"
                  onClick={this.props.walletReset}
                  target="_blank"
                >
                  <img src={signout} alt="" title={i18n.t('sign-out')} className="signout" />
                </button>
                <div id="collective-login" className="hero-menu-link hero-menu-link-signin-simple" target="_blank">
                  <Account publicAddress={this.props.address} width="20px" height="20px" format="plainText" />
                </div>
              </div>
            ) : (
              <div className="hero-button hero-button-mobile hero-signin">
                <div id="collective-login" className="hero-button hero-button-mobile">
                  <button
                    className="hero-menu-link hero-menu-link-signin"
                    target="_blank"
                    onClick={this.props.walletConnect}
                  >
                    {window.innerWidth < 768 ? i18n.t('connect') : i18n.t('sign-in')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div id="cover" className="cover" onClick={this.handleClick} />
      </>
    );
  }
}

Browser.propTypes = {
  address: PropTypes.string,
  walletConnect: PropTypes.func,
  walletReset: PropTypes.func,
};

export default withRouter(Browser);
