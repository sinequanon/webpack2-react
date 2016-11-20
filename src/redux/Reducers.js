import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

const dummyReducer = (state = {}, action) => {
  switch (action.type) {
    case 'stuff':
      return state
    default:
      return state
  }
}

export default combineReducers({
  dummyReducer,
  form: formReducer, // important to mount the reducer as 'form'
})
