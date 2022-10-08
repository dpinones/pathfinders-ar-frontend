import { useContract } from '@starknet-react/core'
import { Abi } from 'starknet'

import JPSAbi from '../abi/main_abi.json'

export function useFormContract() {
  return useContract({
    abi: JPSAbi as Abi,
    address: '0x030edd0a62ac24437c8a9af9a2768092623b2939a4e48642e4a38caeed865577',
  })
}