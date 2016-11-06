import React from 'react'
import { Match } from 'react-router'
import { Provider } from 'react-redux'

import App from './App'
import Home from './Home'
import Home2 from './Home2'
import routeMap from './Routes'
import configureStore from '../redux/configureStore'

const useConfig = false
let appComponent
// Example using declarative Match vs a route config
if (useConfig) {
  appComponent =
      <App>
        { routeMap.map((route, i) =>
          (route.exact && <Match key={i} exactly pattern={route.pattern} component={route.component}/>) ||
          <Match key={i} pattern={route.pattern} component={route.component}/>
        )}
      </App>
} else {
  appComponent =
      <App>
        <Match exactly pattern='/' component={Home} />
        <Match pattern='/page2' component={Home2} />
      </App>
}

export default () =>
    <Provider store={configureStore()}>
      {appComponent}
    </Provider>
