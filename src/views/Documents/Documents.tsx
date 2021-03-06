import React, { StatelessComponent, Fragment } from 'react'
import { Route, Link } from 'react-router-dom'

import MasterDetail from '@/views/MasterDetail'
import DocumentList from '@/views/Documents/DocumentList'
import DocumentDetail from '@/views/Documents/DocumentDetail'
import { Portal as HeaderPortal, Breadcrumb, BreadcrumbItem, Button } from '@/views/Header'

export interface DocumentProps {
  splitView: boolean
}

const Documents: StatelessComponent<DocumentProps>
= ({ splitView }) => (
  <Fragment>
    <HeaderPortal>
      <Route path="/documents" exact render={() =>
        <Fragment>
          <Breadcrumb>
            <BreadcrumbItem><Link to="/documents">Documents</Link></BreadcrumbItem>
          </Breadcrumb>
          <Button><Link to="/editor">New</Link></Button>
        </Fragment>
      } />
    </HeaderPortal>
    <MasterDetail
      splitView={splitView}
      masterPath="/documents"
      detailPath="/documents/:id"
      master={() => <DocumentList />}
      detail={() => <DocumentDetail />}
    />
  </Fragment>
)

export default Documents
