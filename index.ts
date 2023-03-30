import { formatUnits } from '@ethersproject/units';
import { multicall } from '../../utils';

export const author = 'dearseki';
export const version = '0.1.0';

const tokenAddress = '0xa3c322ad15218fbfaed26ba7f616249f7705d945';
const stakingContractAddress = '0x1B2430aeEDECEcaFB52A3ff8Cc8321e9426fC82C';

const abi = [
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
];

export async function strategy(
  _space,
  network,
  provider,
  addresses,
  options,
  snapshot
) {
  const blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
  const response = await multicall(
    network,
    provider,
    abi,
    addresses.map((address: any) => [stakingContractAddress, 'balanceOf', [address]]),
    { blockTag }
  );

  return Object.fromEntries(
    response.map((value, i) => [
      addresses[i],
      parseFloat(formatUnits(value.toString(), options.decimals))
    ])
  );
}
