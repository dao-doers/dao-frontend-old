import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { defaults } from 'lib/const';
import {
  noWallet,
  alreadyVoted,
  pollClosed,
  notSynced,
  notMember,
  noAddress,
  walletError,
} from 'components/Choice/messages';
import { abiLibrary } from 'lib/abi';
import { canVote, hasVoted, execute } from './utils';

import logo from 'images/logo.png';

import { getDescription } from 'components/Post/Post';
import i18n from 'i18n';
import 'styles/Dapp.css';

const numeral = require('numeral');

/**
 * @summary displays the contents of a poll
 */
export default class Choice extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    accountAddress: PropTypes.string,
    percentage: PropTypes.string,
    label: PropTypes.string,
    voteValue: PropTypes.number,
    votingPeriodBegins: PropTypes.string,
    votingPeriodEnds: PropTypes.string,
    description: PropTypes.string,
    proposalIndex: PropTypes.string,
    publicAddress: PropTypes.string,
    daoName: PropTypes.string,
    now: PropTypes.number,
    abi: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };
  }

  getlabelClass() {
    if (Number(this.props.percentage) < 10) {
      return 'poll-score-percentage poll-score-small';
    }
    return 'poll-score-percentage';
  }

  getBarStyle() {
    if (this.props.label === i18n.t('no')) {
      return 'poll-score-bar-fill poll-score-bar-fill-negative';
    }
    return 'poll-score-bar-fill';
  }

  pollOpen() {
    const now = parseInt(this.props.now, 10);
    console.log({
      now,
      begins: this.props.votingPeriodBegins,
      ends: this.props.votingPeriodEnds,
    });
    return this.props.votingPeriodBegins < now && this.props.votingPeriodEnds > now;
  }

  vote = async () => {
    // blockchain sync
    if (!this.props.now || this.props.now === 0) {
      return notSynced();
    }

    // no web3 wallet
    if (!window.web3 || !window.web3.currentProvider) {
      return noWallet();
    }

    // no address
    if (this.props.accountAddress === '0x0') {
      return noAddress();
    }

    // dao membership
    if (!(await canVote(this.props.accountAddress, this.props.publicAddress))) {
      return notMember();
    }

    // already voted
    if (!(await hasVoted(this.props.accountAddress, this.props.proposalIndex, this.props.publicAddress))) {
      return alreadyVoted();
    }

    // poll date
    if (!this.pollOpen()) {
      return pollClosed();
    }

    // vote
    let message;
    switch (this.props.voteValue) {
      case defaults.YES:
        message = i18n.t('dao-confirm-tally', {
          voteValue: i18n.t('yes'),
          proposalName: getDescription(this.props.description).title,
        });
        break;
      case defaults.NO:
        message = i18n.t('dao-confirm-tally', {
          voteValue: i18n.t('no'),
          proposalName: getDescription(this.props.description).title,
        });
        break;
      default:
        message = i18n.t('dao-default-tally', { proposalName: getDescription(this.props.description).title });
    }

    window.modal = {
      icon: logo,
      title: i18n.t('place-vote'),
      message,
      cancel: i18n.t('close'),
      displayBallot: true,
      mode: 'AWAIT',
    };
    window.showModal.value = true;
    return await execute(
      this.props.proposalIndex,
      this.props.voteValue,
      this.props.accountAddress,
      this.props.publicAddress,
    );
  };

  render() {
    return (
      <div className="poll-choice">
        <button className="button half choice" onClick={this.vote}>
          <div className="checkbox-mini check-mini-unselected-box">
            <div className="checkmark_kick check-mini-unselected-mark" />
            <div className="checkmark_stem check-mini-unselected-mark" />
          </div>
          {this.props.label}
          <div className="micro-button micro-button-feed no-underline micro-button-poll">
            <div className="micro-label">{this.props.children}</div>
          </div>
          <div className="poll-score poll-score-button">
            <div className="poll-score-bar">
              <div className={this.getBarStyle()} style={{ width: `${this.props.percentage}%` }} />
            </div>
            <div className={this.getlabelClass()}>{`${numeral(this.props.percentage).format('0.00')}%`}</div>
          </div>
        </button>
      </div>
    );
  }
}
