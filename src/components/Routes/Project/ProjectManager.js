import notification from '@obsidians/notification'
import fileOps from '@obsidians/file-ops'

import { ProjectManager } from '@obsidians/project'

function makeProjectManager (Base) {
  return class PlatonProjectManager extends Base {
    async deploy (contractPath) {
      contractPath = contractPath || await this.getDefaultContract()
      if (contractPath && contractPath.endsWith('.wasm')) {
        const contractName = fileOps.current.path.parse(contractPath).name

        let bytecode
        try {
          bytecode = await fileOps.current.readFile(contractPath, 'hex')
        } catch (e) {
          notification.error('Deploy Error', e.message)
          return
        }

        let contractAbi
        try {
          contractAbi = await this.readContractJson(contractPath.replace('.wasm', '.abi.json'))
        } catch (e) {
          notification.error('Deploy Error', e.message)
          return
        }

        const contractObj = {
          contractName,
          abi: contractAbi,
          bytecode,
          vmType: 1,
        }

        let constructorAbi
        try {
          constructorAbi = await this.getConstructorAbi(contractAbi, { key: 'name', value: 'init' })
        } catch (e) {
          notification.error('Deploy Error', e.message)
          return
        }
        constructorAbi.inputs = constructorAbi.input

        this.deployButton.getDeploymentParameters(constructorAbi, contractObj.contractName || contractName,
          allParameters => this.pushDeployment(contractObj, allParameters),
          allParameters => this.estimate(contractObj, allParameters)
        )
      } else {
        return await super.deploy(contractPath)
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