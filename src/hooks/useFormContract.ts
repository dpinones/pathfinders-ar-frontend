import { useContract } from '@starknet-react/core'
import { Abi } from 'starknet'

import JPSAbi from '../abi/main_abi.json'

export function useFormContract() {
  return useContract({
    abi: JPSAbi as Abi,
    address: '0x05a9bb920e9bdb4056e93ffd524bb4504fd01234cf7fb6f35899704c0d523281',
  })
}