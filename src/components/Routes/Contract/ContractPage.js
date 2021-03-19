import redux from '@obsidians/redux'
import { ContractPage } from '@obsidians/contract'

export default class PlatonContractPage extends ContractPage {
  getAbiData (codeHash) {
    const abiData = redux.getState().abis.get(codeHash)?.toJS()
    if (!abiData) {
      return
    }
    if (abiData.vmType) {
      console.log(abiData.vmType)
      return { abi: [], vmType: abiData.vmType }
    }
    try {
      abiData.abi = JSON.parse(abiData.abi)
    } catch {
      throw new Error('Invalid ABI structure.')
    }
    return abiData
  }
}