import React, { PureComponent } from 'react'

import {
  ToolbarButton,
} from '@obsidians/ui-components'

import fileOps from '@obsidians/file-ops'

export default class FaucetButton extends PureComponent {
  claim = async () => {
    if (this.props.network === 'platon-devnet') {
      fileOps.current.openLink('https://faucet.platon.network/faucet')
    } else {
      fileOps.current.openLink('https://faucet.alaya.network/faucet')
    }
  }

  render () {
    if (this.props.network !== 'alaya-devnet' && this.props.network !== 'platon-devnet') {
      return null
    }
    return (
      <ToolbarButton
        id='navbar-platon-faucet'
        size='md'
        icon='fas fa-faucet'
        tooltip='Faucet'
        onClick={this.claim}
      />
    )
  }
}
