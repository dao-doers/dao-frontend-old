import {
  noWallet,
  alreadyVoted,
  pollClosed,
  notSynced,
  notMember,
  noAddress,
  walletError,
} from 'components/Choice/messages';
import { config } from 'config';
import logo from 'images/logo.png';
import i18n from 'i18n';
import { abiLibrary } from '../../lib/abi';

const Web3 = require('web3');
const { PolyjuiceAccounts, PolyjuiceHttpProvider } = require('@polyjuice-provider/web3');
const { AddressTranslator } = require('nervos-godwoken-integration');

const providerConfig = {
  web3Url: 'https://godwoken-testnet-web3-rpc.ckbapp.dev',
};

const addressTranslator = new AddressTranslator();

const provider = new PolyjuiceHttpProvider(providerConfig.web3Url, providerConfig);

const polyjuiceAccounts = new PolyjuiceAccounts(providerConfig);

const web3 = new Web3(provider);
web3.eth.accounts = polyjuiceAccounts;
web3.eth.Contract.setProvider(provider, web3.eth.accounts);

const getDao = async address => {
  const dao = await new web3.eth.Contract(abiLibrary.moloch2, address);
  return dao;
};

export const canVote = async (accountAddress, daoAddress) => {
  console.log('canVote', {
    accountAddress,
  });

  const accountPolyAddress = addressTranslator.ethAddressToGodwokenShortAddress(accountAddress);

  const dao = await getDao(daoAddress);

  console.log({
    daoAddress,
    accountPolyAddress,
  });

  const response = await dao.methods.members(accountPolyAddress).call({}, (err, res) => {
    if (err) {
      walletError(err);
      return err;
    }
    return res;
  });
  return response.exists;
};

export const hasVoted = async (accountAddress, proposalIndex, daoAddress) => {
  const dao = await getDao(daoAddress);
  const accountPolyAddress = addressTranslator.ethAddressToGodwokenShortAddress(accountAddress);

  const response = await dao.methods.getMemberProposalVote(accountPolyAddress, proposalIndex).call({}, (err, res) => {
    if (err) {
      walletError(err);
      return err;
    }
    return res;
  });
  return response === 0 || response === '0';
};

export const execute = async (proposalIndex, voteValue, accountAddress, daoAddress) => {
  const dao = await getDao(daoAddress);
  await dao.methods.submitVote(proposalIndex, voteValue).send({ from: accountAddress }, (err, res) => {
    if (err) {
      walletError(err);
      return err;
    }
    if (res) {
      window.showModal.value = false;
      window.modal = {
        icon: logo,
        title: i18n.t('vote-cast'),
        message: i18n.t('voting-interaction', { etherscan: `${config.web.explorer}/tx/${res}` }),
        cancelLabel: i18n.t('close'),
        mode: 'ALERT',
      };
      window.showModal.value = true;
    }
    return res;
  });
};
