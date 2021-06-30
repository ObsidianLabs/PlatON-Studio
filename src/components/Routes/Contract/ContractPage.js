import { ContractPage } from '@obsidians/contract'

export default class PlatonContractPage extends ContractPage {
  separateAbi = abi => {
    const actions = []
    const views = []
    const events = []

    abi.abi.forEach(item => {
      switch (item.type) {
        case 'event':
        case 'Event':
          events.push(item)
          break
        case 'function':
          if (['view', 'pure'].indexOf(item.stateMutability) > -1) {
            views.push(item)
          } else {
            actions.push(item)
          }
          break
        case 'Action':
          if (item.constant) {
            views.push({ ...item, inputs: item.input })
          } else {
            actions.push({ ...item, inputs: item.input })
          }
          break
        default:
      }
    })
    return { actions, views, events }
  }
}