import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'

import { connect } from '@obsidians/redux'
import Network from '@obsidians/network'
import nodeManager from '@obsidians/node'

nodeManager.generateCommand = ({ name, version }) => {
  const containerName = `${process.env.PROJECT}-${name}-${version}`

  return [
    'docker run -it --rm',
    `--name ${containerName}`,
    `-p 6789:6789`,
    `-p 16789:16789`,
    `-v ${process.env.PROJECT}-${name}:/data`,
    `-w /data`,
    `${process.env.DOCKER_IMAGE_NODE}:${version}`,
    `platon --identity platon --datadir . --port=16789 --rpc --rpcaddr=0.0.0.0 --rpcport=6789 --rpccorsdomain=* --rpcvhosts=* --rpcapi=db,platon,net,web3,admin,personal --nodiscover --nodekey=./nodekey --cbft.blskey=./blskey`
  ].join(' ')
}

class NetworkWithProps extends PureComponent {
  state = {
    active: true
  }

  componentDidMount () {
    this.props.cacheLifecycles.didCache(() => this.setState({ active: false }))
    this.props.cacheLifecycles.didRecover(() => this.setState({ active: true }))
  }

  render () {
    return (
      <Network
        minerKey
        networkId={this.props.network}
        active={this.state.active}
      />
    )
  }
}


export default connect([
  'network',
])(withRouter(NetworkWithProps))
