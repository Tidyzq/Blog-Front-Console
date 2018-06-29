import React, { StatelessComponent, Fragment } from 'react'
import { Route, Link } from 'react-router-dom'

import MasterDetail from '@/views/MasterDetail'
import TagDetail from '@/views/Tags/TagDetail'
import TagList from '@/views/Tags/TagList'
import { Portal as HeaderPortal, Breadcrumb, BreadcrumbItem, Button } from '@/views/Header'

export interface TagsProps {
  splitView: boolean
}

const Tags: StatelessComponent<TagsProps> =
({ splitView }) => (
  <Fragment>
    <HeaderPortal>
      <Route path="/tags" exact render={() =>
        <Fragment>
          <Breadcrumb>
            <BreadcrumbItem><Link to="/tags">Tags</Link></BreadcrumbItem>
          </Breadcrumb>
          <Button><Link to="/editor">New</Link></Button>
        </Fragment>
      } />
    </HeaderPortal>
    <MasterDetail
      splitView={splitView}
      masterPath="/tags"
      detailPath="/tags/:id"
      master={() => <TagList />}
      detail={() => <TagDetail />}
    />
  </Fragment>
)

export default Tags
