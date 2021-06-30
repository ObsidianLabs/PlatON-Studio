import notification from '@obsidians/notification'
import fileOps from '@obsidians/file-ops'

import { ProjectManager } from '@obsidians/project'

function makeProjectManager (Base) {
  return class PlatonProjectManager extends Base {
    async readProjectAbis () {
      const projectAbis = await super.readProjectAbis()
      if (this.projectSettings?.settings?.language === 'cpp') {
        return projectAbis.map(item => ({
          ...item,
          abi: item.content,
        }))
      }
      return projectAbis
    }

    async deploy (contractFileNode) {
      contractFileNode = contractFileNode || await this.getDefaultContractFileNode()
      if (contractFileNode?.path?.endsWith('.wasm')) {
        const abiPath = contractFileNode.path.replace('.wasm', '.abi.json')
        const abiName = fileOps.current.path.parse(abiPath).base

        let bytecode
        try {
          bytecode = await fileOps.current.readFile(contractFileNode.path, 'hex')
        } catch (e) {
          notification.error('Deploy Error', e.message)
          return
        }

        this.deployButton.getDeploymentParameters({
          contractFileNode: {
            path: abiPath,
            pathInProject: contractFileNode.pathInProject,
          },
          contracts: [abiName],
          getConstructorAbiArgs: contractObj => [
            contractObj.map(item => {
              return {
                ...item,
                inputs: item.input,
                type: item.type === 'Action' ? 'function' : '',
                stateMutability: item.constant ? 'view' : ''
              }
            }),
            { key: 'name', value: 'init' }
          ]
        },
          (abi, allParameters) => this.pushDeployment(this.buildContractObj(allParameters.contractName, abi, bytecode), allParameters),
          (abi, allParameters) => this.estimate(this.buildContractObj(allParameters.contractName, abi, bytecode), allParameters)
        )
      } else {
        return await super.deploy(contractFileNode)
      }
    }

    buildContractObj (contractName, abi, bytecode) {
      return {
        contractName,
        abi,
        bytecode,
        vmType: 1,
      }
    }

    validateDeployment (contractObj) {
      if (contractObj.vmType) {
        return {
          abi: contractObj.abi,
          bytecode: contractObj.bytecode,
          deployedBytecode: `0x${contractObj.bytecode}`,
          options: { vmType: contractObj.vmType }
        }
      } else {
        return super.validateDeployment(contractObj)
      }
    }
  }
}

export default {
  Local: makeProjectManager(ProjectManager.Local),
  Remote: makeProjectManager(ProjectManager.Remote),
}