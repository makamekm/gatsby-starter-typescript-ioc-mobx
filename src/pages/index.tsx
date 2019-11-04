import * as React from 'react'
import { Link } from 'gatsby'

import Panel from '../components/panel'
import { useInstance } from 'react-ioc'
import { UserService } from '../services/user.service'
import { observer } from 'mobx-react'

const IndexPage = () => {
  const userService = useInstance(UserService)
  return (
    <>
      <h1>Hi people</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <Link to="/page-2/">Go to page 2</Link>
      <Panel>Hello World! {userService.user && userService.user.email}</Panel>
    </>
  )
}

export default observer(IndexPage)
