import Contract from '@obsidians/contract'
import ContractPage from './ContractPage'

Contract.defaultProps = {
  ...Contract.defaultProps,
  Page: ContractPage,
}

export default Contract
