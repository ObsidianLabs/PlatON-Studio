const { IpcChannel } = require('@obsidians/ipc')
const KeypairManager = require('@obsidians/keypair')
const { AutoUpdate } = require('@obsidians/global')
const ProjectChannel = require('@obsidians/platon-project')
const CompilerManager = require('@obsidians/platon-compiler')
const { InstanceManager } = require('@obsidians/platon-network')
const { SdkChannel } = require('@obsidians/platon-sdk')
const AuthChannel = require('@obsidians/auth')

let ipcChannel, keypairManager, autoUpdate, projectChannel, compilerManager, instanceManager, authChannel
module.exports = function () {
  ipcChannel = new IpcChannel()
  keypairManager = new KeypairManager(process.env.PROJECT)
  autoUpdate = new AutoUpdate('https://app.obsidians.io/api/v1/check-update/platon/')
  projectChannel = new ProjectChannel()
  compilerManager = new CompilerManager()
  instanceManager = new InstanceManager()
  sdkChannel = new SdkChannel(keypairManager)
  authChannel = new AuthChannel()
}
