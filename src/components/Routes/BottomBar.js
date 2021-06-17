import BottomBar from '@obsidians/bottombar'

BottomBar.defaultProps = {
  mnemonic: false,
  chains: [
    { key: 'dev', text: 'Local (Alaya)', filter: key => key.startsWith('atx') },
    { key: 'alaya', text: 'Alaya Devnet', filter: key => key.startsWith('atp') },
  ]
}

export default BottomBar
