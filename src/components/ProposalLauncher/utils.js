/* IMPORTS */
// Functions
import { _ } from 'numbro';
import BigNumber from 'bignumber.js/bignumber';
import { walletError, notMember } from '../Choice/messages';
import { prposalSubmitted } from './messages';
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

export const getBlockNumber = web3.eth.getBlockNumber();
// UX utils
export const hideProposalLauncher = () => {
  window.showProposalLauncher.value = false;
};

export const showProposalLauncher = address => {
  window.proposalLauncher = { address };
  window.showProposalLauncher.value = true;
};

export const hideAlert = () => {
  window.showAlert = false;
};

export const showAlert = () => {
  window.showAlert = true;
};

export const CLEARED_TYPES = {
  isNewMember: false,
  isFunding: false,
  isTrade: false,
  isGuildKick: false,
  isWhitelist: false,
};
export const CLEARED_NUMBERS = {
  sharesRequested: 0,
  lootRequested: 0,
  tributeOffered: 0,
  paymentRequested: 0,
};

// Validation utils
export const isAddress = async address => {
  const web3 = await new Web3(window.web3.currentProvider);
  return await web3.utils.isAddress(address);
};

export const isMember = async (
  memberAddress,
  /* Contract information */
  contractAddress,
) => {
  const web3 = await new Web3(window.web3.currentProvider);

  const isAddress = await web3.utils.isAddress(memberAddress);
  if (!isAddress) return false;

  const dao = await new web3.eth.Contract(abiLibrary.moloch2, contractAddress);

  const memberPolyAddress = addressTranslator.ethAddressToGodwokenShortAddress(memberAddress);

  console.log({
    memberAddress,
    contractAddress,
    memberPolyAddress,
  });

  const response = await dao.methods.members(memberPolyAddress).call({}, (err, res) => {
    console.log('call', {
      err,
      res,
    });
    if (err) {
      walletError(err);
      return err;
    }
    return res;
  });
  return response.exists;
};

export const notNull = (...args) => {
  let validated = true;
  args.forEach(a => {
    if (a === '0x0' || a === '') validated = false;
  });
  return validated;
};

// Submitting utils
const getDao = async address => {
  const dao = await new web3.eth.Contract(abiLibrary.moloch2, address);
  return dao;
};

const getEstimatedGas = async proposal =>
  // let gas
  // try{
  //     gas = await proposal.estimateGas().then(gas=> gas)
  // } catch (err){
  //     console.log('ERROR: ', err)
  // }
  6000000;

const getReceipt = async (proposal, user, estimatedGas) => {
  let receipt;
  try {
    receipt = await proposal.send({ from: user, gas: estimatedGas }).on('receipt', receipt => {
      prposalSubmitted();
      showAlert();
      console.log('RECEIPT: ', receipt);
      return receipt;
    });
  } catch (err) {
    walletError(err);
    receipt = err;
  }
  return receipt;
};

// Submitting functions
export const submitProposal = async (
  /* Wallet information */
  user,
  /* Contract information */
  library,
  version,
  daoAddress,
  /* Proposal information */
  applicantAddress,
  sharesRequested,
  lootRequested,
  tributeOffered,
  tributeToken,
  paymentRequested,
  paymentToken,
  details,
) => {
  console.log('SUBMITTING NEW PROPOSAL...');
  const dao = await getDao(daoAddress);
  const token = new web3.eth.Contract(abiLibrary.erc20, await dao.methods.depositToken().call());

  const userPolyAddress = addressTranslator.ethAddressToGodwokenShortAddress(user);

  const applicantPolyAddress = addressTranslator.ethAddressToGodwokenShortAddress(applicantAddress);

  const userBalance = new BigNumber(await token.methods.balanceOf(userPolyAddress).call());
  const allowance = new BigNumber(await token.methods.allowance(userPolyAddress, daoAddress).call());
  const tributeOfferedBN = new BigNumber(tributeOffered);

  const requiredAllowance = tributeOfferedBN;

  console.log({
    userBalance,
    allowance,
    requiredAllowance,
    tributeOfferedBN,
    token,
  });

  if (userBalance.lt(requiredAllowance)) {
    throw new Error('Not enough funds to pay the tribute.');
  }

  if (allowance.lt(requiredAllowance)) {
    await token.methods.approve(daoAddress, requiredAllowance).send({
      from: user,
    });
  }

  console.log('submitProposal', {
    applicantPolyAddress,
    sharesRequested,
    lootRequested,
    tributeOffered,
    tributeToken,
    paymentRequested,
    paymentToken,
    details,
    version,
  });

  const proposal = await dao.methods.submitProposal(
    applicantPolyAddress,
    sharesRequested,
    lootRequested,
    tributeOffered,
    tributeToken,
    paymentRequested,
    paymentToken,
    `{"title": "${details.title}", "description": "${details.description}", "link": "${details.link}"}`,
  );

  const estimatedGas = await getEstimatedGas(proposal);
  const receipt = await getReceipt(proposal, user, estimatedGas);
  return receipt;
};

export const submitWhitelistProposal = async (
  /* Wallet information */
  user,
  /* Contract information */
  library,
  version,
  address,
  /* Proposal information */
  tokenToWhitelist,
  details,
) => {
  console.log('SUBMITTING NEW WHITELIST PROPOSAL...');
  const dao = await getDao(address);
  const proposal = await dao.methods.submitWhitelistProposal(tokenToWhitelist, details);
  const estimatedGas = await getEstimatedGas(proposal);
  const receipt = await getReceipt(proposal, user, estimatedGas);
  return receipt;
};

export const submitGuildKickProposal = async (
  /* Wallet information */
  user,
  /* Contract information */
  library,
  version,
  address,
  /* Proposal information */
  memberToKick,
  details,
) => {
  console.log('SUBMITTING NEW GUILD KICK PROPOSAL...');
  const dao = await getDao(address);
  const proposal = await dao.methods.submitGuildKickProposal(memberToKick, details);
  const estimatedGas = await getEstimatedGas(proposal);
  const receipt = await getReceipt(proposal, user, estimatedGas);
  return receipt;
};

export const sponsorProposal = async (
  /* Wallet information */
  user,
  /* Contract information */
  daoAddress,
  /* Proposal information */
  proposalId,
) => {
  console.log('SPONSORING PROPOSAL...', {
    user,
    daoAddress,
    proposalId,
  });
  const dao = await getDao(daoAddress);

  const token = new web3.eth.Contract(abiLibrary.erc20, await dao.methods.depositToken().call());

  const userPolyAddress = addressTranslator.ethAddressToGodwokenShortAddress(user);

  const userBalance = new BigNumber(await token.methods.balanceOf(userPolyAddress).call());
  const allowance = new BigNumber(await token.methods.allowance(userPolyAddress, daoAddress).call());
  const proposalDeposit = new BigNumber(await dao.methods.proposalDeposit().call());

  console.log({
    userBalance,
    allowance,
    proposalDeposit,
  });

  if (userBalance.lt(proposalDeposit)) {
    throw new Error('Not enough funds to pay for proposalDeposit.');
  }

  if (allowance.lt(proposalDeposit)) {
    await token.methods.approve(daoAddress, proposalDeposit).send({
      from: user,
    });
  }

  const proposal = await dao.methods.sponsorProposal(proposalId);

  const estimatedGas = await getEstimatedGas(proposal);
  const receipt = await getReceipt(proposal, user, estimatedGas);
  return receipt;
};
