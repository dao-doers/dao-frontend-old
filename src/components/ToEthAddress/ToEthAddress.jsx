import { Godwoker } from '@polyjuice-provider/base';

export const ToEthAddress = async polyjuiceAddress => {
  const godwokenRPC = 'https://godwoken-testnet-web3-rpc.ckbapp.dev';

  const godwoker = new Godwoker(godwokenRPC, {
    godwoken: {
      rollup_type_hash: '0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a',
      eth_account_lock: {
        code_hash: '0xdeec13a7b8e100579541384ccaf4b5223733e4a5483c3aec95ddc4c1d5ea5b22',
        hash_type: 'type',
      },
    },
  });

  return await godwoker.getEthAddressByAllTypeShortAddress(polyjuiceAddress);
};
