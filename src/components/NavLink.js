import React from 'react'
import { Link } from 'react-router'

class NavLink extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const isIndex = this.props.to === '/'
    return (
      isIndex ?
      <Link className='navlink' activeOnlyWhenExact {...this.props} activeClassName='active'/> :
      <Link className='navLink' {...this.props} activeClassName='active'/>
    )
  }
}

export default NavLink
