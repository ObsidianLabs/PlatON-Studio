import get from 'lodash/get'

import platform from '@obsidians/platform'
import { globalModalManager } from '@obsidians/global'
import { actions as projectActions } from '@obsidians/workspace'

const handlers = {}
if (platform.isDesktop) {
  const { ipcRenderer } = window.require('electron')

  handlers.about = () => globalModalManager.openAboutModal()
  handlers.project = {}

  projectActions.channel.on('ready', (action, namespace) => {
    handlers.project[action] = projectActions[action].bind(projectActions)
  })

  ipcRenderer.on('menu-click', (event, action) => {
    const handler = get(handlers, action)
    if (handler) {
      handler()
    } else {
      console.warn(new Error(`No handler for menu click: ${action}`))
    }
  })
}


export default handlers
