import React from 'react'
import ReactDOM, { unmountComponentAtNode } from 'react-dom'
import { AppContainer } from 'react-hot-loader' // Support hot loading

import Root from './components/Root'

const DOM_MOUNT_POINT = document.querySelector('.appMountPoint')

const render = (mountPoint => {
  return appRoot => ReactDOM.render(appRoot, mountPoint)
})(DOM_MOUNT_POINT)

render(<AppContainer><Root/></AppContainer>)

if (module.hot) { // This only runs in DEV
  module.hot.accept('./components/Root', () => {
    // Reload and rename the root module. You cannot reuse the Root
    // variable. The inexplicable will happen if you do.
    const HotRoot = require('./components/Root').default   // eslint-disable-line
    // Prevent the hot reloading error from react-router
    unmountComponentAtNode(DOM_MOUNT_POINT)
    render(<AppContainer><HotRoot/></AppContainer>)
  })
}
