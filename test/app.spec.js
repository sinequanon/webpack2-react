import React from 'react'
import { mount } from 'enzyme'
import jsdom from 'jsdom-global'
import { expect } from 'chai'
import Home from '../src/components/Home'

describe('Home', function () {
  let home
  before(function () {
    jsdom()
    home = mount(<Home/>)
  })

  it('should render into document', function () {
    expect(home).to.be.a('object')
  })

  it('should include the correct number of elements', function () {
    expect((home).find('h1')).to.have.length(1)
  })
})
