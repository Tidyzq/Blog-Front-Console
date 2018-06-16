import React, { StatelessComponent, Fragment } from 'react'
import { Route, Link } from 'react-router-dom'

import MasterDetail from '@/views/MasterDetail'
import UserDetail from '@/views/Users/UserDetail'
import UserList from '@/views/Users/UserList'
import { Portal as HeaderPortal, Breadcrumb, BreadcrumbItem, Button } from '@/views/Header'

export interface UsersProps {
  splitView: boolean
}

const Users: StatelessComponent<UsersProps> =
({ splitView }) => (
  <Fragment>
    <HeaderPortal>
      <Route path="/users" exact render={() =>
        <Fragment>
          <Breadcrumb>
            <BreadcrumbItem><Link to="/users">Users</Link></BreadcrumbItem>
          </Breadcrumb>
          <Button><Link to="/editor">New</Link></Button>
        </Fragment>
      } />
    </HeaderPortal>
    <MasterDetail
      splitView={splitView}
      masterPath="/users"
      detailPath="/users/:id"
      master={() => <UserList />}
      detail={() => <UserDetail />}
    />
  </Fragment>
)

export default Users
