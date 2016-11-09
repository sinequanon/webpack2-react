import React from 'react'
import ReactDOM, { unmountComponentAtNode } from 'react-dom'
// Support hot loading
import { AppContainer } from 'react-hot-loader'  /* eslint import/no-extraneous-dependencies: 0 */
import { BrowserRouter } from 'react-router'

import Root from './components/Root'
import './styles/app.css'

const DOM_MOUNT_POINT = document.querySelector('.appMountPoint')

const render = (mountPoint =>
  appRoot => ReactDOM.render(appRoot, mountPoint)
)(DOM_MOUNT_POINT)

const IS_PROD = process.env.NODE_ENV === 'production'
const rootComponent = IS_PROD ?
  <BrowserRouter><Root/></BrowserRouter> :
  <AppContainer><BrowserRouter><Root/></BrowserRouter></AppContainer>

render(rootComponent)

if (module.hot) { // This only runs in DEV
  module.hot.accept('./components/Root', () => {
    // Reload and rename the root module. You cannot reuse the Root
    // variable. The inexplicable will happen if you do.
    const HotRoot = require('./components/Root').default  // eslint-disable-line
    // Prevent the hot reloading error from react-router
    unmountComponentAtNode(DOM_MOUNT_POINT)
    render(<AppContainer><BrowserRouter><HotRoot/></BrowserRouter></AppContainer>)
  })
}
