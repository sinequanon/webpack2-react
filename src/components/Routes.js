import Home from './Home'
import Home2 from './Home2'

export default [
  { pattern: '/', exact: true, component: Home },
  { pattern: '/page2', component: Home2 }
  // { pattern: '/propsVsState', component: PropsVsState },
  // { pattern: '/routeParams/:first/:second', component: RouteParams },
  // { pattern: '/forms', component: Forms }
]
