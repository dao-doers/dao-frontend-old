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
import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
import DChart from 'components/DChart/DChart';
Chart.register(ArcElement);
const numbro = require('numbro');

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
    data: PropTypes.any,
    TextYes: PropTypes.any,
    TextMiddleYes: PropTypes.any,
    TextBottomYes: PropTypes.any,
    percentageYes: PropTypes.any,
    nameYes: PropTypes.any,
    TextNo: PropTypes.any,
    TextMiddleNo: PropTypes.any,
    TextBottomNo: PropTypes.any,
    percentageNo: PropTypes.any,
    nameNo: PropTypes.any
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
  render(
    
  ) {
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
            <div className={this.getlabelClass()}>{`${numbro(this.props.percentage).format('0.00')}%`}</div>
          </div>
        </button>
          <Doughnut
          data={{
            labels: [i18n.t('yes'), i18n.t('no')],
            datasets: [
              {
                label: '# of Votes',
                data: this.props.data,
                backgroundColor: [
                  "#01c190",
                  "#ff3d67",
                ],
                cutout: '85%',
                // hoverOffset: 4,
                borderColor: '#fff',
                borderWidth: 1,
                hoverBorderColor: ['#96ceff', '#424348'],
                hoverBorderWidth: 5,
   
              },
            ],
          }}
          plugins= {[{
            id: 'text',
            beforeDraw: function(chart, a, b) {
              var width = chart.width,
                height = chart.height,
                ctx = chart.ctx;
        
              ctx.restore();
              var fontSize = (height / 114).toFixed(2);
              ctx.font = fontSize + "em sans-serif";
              ctx.textBaseline = "middle";
        
              var text = `Voting`,
                textX = Math.round((width - ctx.measureText(text).width) / 2),
                textY = height / 2;
        
              ctx.fillText(text, textX, textY);
              ctx.save();
            }
          }]}
        
          options={{
            layout: {
              padding: 40
          },
            onClick: this.vote,
            responsive:true,
            plugins: {
                labels: {
                    render: 'percentage',
                    precision: 2,
                    showZero: true,
                    fontSize: 30,
                    fontColor: ['#2c405a', '#2c405a', 'white'],
                    fontFamily: "PTSansBold",
                }
            },
            animation: {
                duration: 1000
            },
        //   tooltips: {
        //     callbacks: {
        //         label: (tooltipItem, data) => {
        //             const dataset = data.datasets[tooltipItem.datasetIndex];
        //             const meta = dataset._meta[Object.keys(dataset._meta)[0]];
        //             const total = meta.total;
        //             const currentValue = tooltipItem?.value;
        //             const percentage = parseFloat((currentValue/total*100).toFixed(1));
        //             return currentValue + ' (' + percentage + '%)';
        //         },
        //         title: tooltipItem =>
        //             `${tooltipItem[0]?.label}`
        //     }
        // },
        }}
        />
                      {/* <DChart
defaultTextTop= 'Users by posts'
defaultTextMiddle= 'Vote now'
defaultTextBottom= 'Please share'
loadingAnimationDuration= {1000}
size= {200}
data={[
  {
    color: 'var(--positive-signal-color)',
    textTop: 'yes',
    textMiddle: 'yes',
    textBottom: 'yes',
    value: 40,
    name: 'yes'
  },
  {
    color: 'var(--negative-signal-color)',
    textTop: 'no',
    textMiddle: 'no',
    textBottom: 'no',
    value: 60,
    name: 'no',
  },
]}
        /> */}
      </div>
    );
  }
}
