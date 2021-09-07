import React, { PureComponent } from 'react'

import {
  FormGroup,
  Label,
  ButtonOptions,
  DropdownInput,
} from '@obsidians/ui-components'

import notification from '@obsidians/notification'
import { DockerImageInputSelector } from '@obsidians/docker'
import compilerManager from '@obsidians/compiler'

const frameworkNames = {
  'alaya-truffle': 'Alaya Truffle',
  'alaya-truffle-docker': `Dockerized ${process.env.COMPILER_NAME}`,
}

const alayaTruffleVersions = [
  { id: '0.13.2', display: '0.13.2' },
]

export default class FrameworkSelector extends PureComponent {
  static frameworkNames = frameworkNames
  
  constructor (props) {
    super(props)

    this.state = {
      alayaTruffleVersion: '0.13.2',
      alayaTruffleDockerVersion: '',
    }
  }

  getNameAndVersion = (framework, remote) => {
    if (remote) {
      return { name: '', version: '' }
    }
    const name = frameworkNames[framework]
    const version = framework === 'alaya-truffle-docker'
      ? this.state.alayaTruffleDockerVersion
      : this.state.alayaTruffleVersion
    return { name, version }
  }

  installDependencies = async ({
    framework,
    npmClient,
    installCommand,
    compilerVersion,
    projectRoot,
    terminal,
  }) => {
    if (framework === 'alaya-truffle') {
      const result = await terminal.exec(`${npmClient} ${installCommand} alaya-truffle@${compilerVersion}`, { cwd: projectRoot })
      if (result.code) {
        notification.error('Fail to Install Conflux Truffle')
        return false
      }
    }
    return true
  }

  renderFrameworkVersions = () => {
    const { framework } = this.props
    const { alayaTruffleVersion, alayaTruffleDockerVersion } = this.state
    if (framework === 'alaya-truffle') {
      return (
        <FormGroup className='mb-2'>
          <Label>Alaya truffle version</Label>
          <DropdownInput
            size='sm'
            options={alayaTruffleVersions}
            value={alayaTruffleVersion}
            onChange={alayaTruffleVersion => this.setState({ alayaTruffleVersion })}
          />
        </FormGroup>
      )
    } else if (framework === 'alaya-truffle-docker') {
      return (
        <FormGroup className='mb-2'>
          <Label>{`${process.env.COMPILER_NAME_IN_LABEL} version`}</Label>
          <DockerImageInputSelector
            size='sm'
            key='alaya-truffle-selector'
            label=''
            channel={compilerManager.truffle}
            noneName={`${process.env.COMPILER_NAME}`}
            modalTitle={`${process.env.COMPILER_NAME} Manager`}
            downloadingTitle={`Downloading ${process.env.COMPILER_NAME}`}
            selected={alayaTruffleDockerVersion}
            onSelected={alayaTruffleDockerVersion => this.setState({ alayaTruffleDockerVersion })}
          />
        </FormGroup>
      )
    }
    return null
  }
 
  render () {
    const { framework, group, onSelectFramework } = this.props

    const options = [{ key: 'alaya-truffle-docker', text: frameworkNames['alaya-truffle-docker'] }]
    if (group !== process.env.COMPILER_NAME) {
      options.unshift({ key: 'alaya-truffle', text: frameworkNames['alaya-truffle'] })
    }

    return (
      <div className='row'>
        <div className='col-12 col-sm-7'>
          <FormGroup>
            <Label>Framework</Label>
            <div>
              <ButtonOptions
                size='sm'
                className='mb-0'
                options={options}
                selected={framework}
                onSelect={onSelectFramework}
              />
            </div>
          </FormGroup>
        </div>
        <div className='col-12 col-sm-5'>
          {this.renderFrameworkVersions()}
        </div>
      </div>
    )
  }
}
