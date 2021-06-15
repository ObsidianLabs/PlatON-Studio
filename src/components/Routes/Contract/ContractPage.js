import redux from '@obsidians/redux'
import { ContractPage } from '@obsidians/contract'

const types = {
  Action: 'function',
  Event: 'event',
}

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
          type: types[item.type],
          stateMutability: item.constant ? 'view' : ''
        }
      })
    }
    return abiData
  }
}