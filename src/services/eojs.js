import Eos from 'eosjs';
import { EOS_ENDPOINT, CHAIN_ID } from '../constants/constants';

const EOS = async () => {
  const eos = Eos({
    httpEndpoint: EOS_ENDPOINT,
    chainId: CHAIN_ID,
    verbose: true
  })

  return { eos, chain: await eos.getInfo({}) }
}

export default EOS;
