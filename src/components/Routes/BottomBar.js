import BottomBar from '@obsidians/bottombar'

BottomBar.defaultProps = {
  mnemonic: true,
  chains: [
    { key: 'dev', text: 'Local (Alaya)', filter: key => key.startsWith('atx') },
    { key: 'alaya', text: 'Alaya', filter: key => key.startsWith('atp') },
    // { key: 'platon', text: 'PlatON', filter: key => key.startsWith('lat') },
  ]
}

export default BottomBar
