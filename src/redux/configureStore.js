/* eslint
   global-require: "off",
   import/no-extraneous-dependencies: "off",
   import/newline-after-import: "off",
   no-underscore-dangle: "off"
*/
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

import reducers from './Reducers'

export default (initialState = {}) => {
  const middleware = [thunkMiddleware]
  const IS_PROD = process.env.NODE_ENV === 'production'
  if (!IS_PROD) {
    // Importing the redux-logger only in DEV
    middleware.push(require('redux-logger')())
  }
  // Support redux dev tools
  const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  const store = createStore(
    reducers,
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware)
    ),
  )

  if (module.hot) {
    module.hot.accept('./Reducers', () => {
      console.log('Reloading reducers...') // eslint-disable-line
      const nextRootReducer = require('./Reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}
