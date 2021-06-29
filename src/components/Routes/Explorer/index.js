import Explorer from '@obsidians/explorer'
import FaucetButton from './FaucetButton'

Explorer.defaultProps = {
  ...Explorer.defaultProps,
  ExtraToolbarButtons: FaucetButton,
}

export default Explorer
