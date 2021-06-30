import React, { PureComponent } from 'react'

import {
  ToolbarButton,
} from '@obsidians/ui-components'

import fileOps from '@obsidians/file-ops'

export default class FaucetButton extends PureComponent {
  claim = async () => {
    if (this.props.network === 'platon-devnet') {
      fileOps.current.openLink('https://faucet.platon.network/faucet/?id=39fa041c887f11eba4f000163e06ae15')
    } else {
      fileOps.current.openLink('https://faucet.alaya.network/faucet/?id=f93426c0887f11eb83b900163e06151c')
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
