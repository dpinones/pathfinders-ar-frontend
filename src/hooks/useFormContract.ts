import { useContract } from '@starknet-react/core'
import { Abi } from 'starknet'

import JPSAbi from '../abi/main_abi.json'

export function useFormContract() {
  return useContract({
    abi: JPSAbi as Abi,
    address: '0x026dce3cdedbc3e76408500ceb01b72d8888a0aaccb9b5088a6f6ac4e5e8c1af',
  })
}