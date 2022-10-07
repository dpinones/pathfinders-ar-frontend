import { useContract } from '@starknet-react/core'
import { Abi } from 'starknet'

import JPSAbi from '../abi/main_abi.json'

export function useFormContract() {
  return useContract({
    abi: JPSAbi as Abi,
    address: '0x2828c45f249ce1e6f8ae9e0a231757296810467246e7a19d9cced99142494a0',
  })
}