import redux from '@obsidians/redux'
import { ContractPage } from '@obsidians/contract'

export default class PlatonContractPage extends ContractPage {
  getAbiData (codeHash) {
    const abiData = redux.getState().abis.get(codeHash)?.toJS()
    if (!abiData) {
      return
    }
    try {
      abiData.abi = JSON.parse(abiData.abi)
    } catch {
      throw new Error('Invalid ABI structure.')
    }
    if (abiData.vmType) {
      abiData.abi = abiData.abi.map(item => {
        return {
          ...item,
          inputs: item.input,
          type: item.type === 'Action' ? 'function' : '',
          stateMutability: item.constant ? 'view' : ''
        }
      })
    }
    return abiData
  }
}