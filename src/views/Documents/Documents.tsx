import React, { StatelessComponent, Fragment } from 'react'
import { Route, Switch, Link } from 'react-router-dom'
import MainContent from '@/views/MainContent'
import DocumentList from '@/views/DocumentList/index'
import DocumentDetail from '@/views/DocumentDetail/index'
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
          <Button>New</Button>
        </Fragment>
      } />
      <Route path="/documents/:id" exact render={({ match }) =>
        <Fragment>
          <Breadcrumb>
            <BreadcrumbItem><Link to="/documents">Documents</Link></BreadcrumbItem>
            <BreadcrumbItem>{match.params.id}</BreadcrumbItem>
          </Breadcrumb>
          <Button><Link to={`/editor/${match.params.id}`}>Edit</Link></Button>
        </Fragment>
      } />
    </HeaderPortal>
    <Switch>
      <Route exact path="/documents" render={() =>
        <MainContent>
          <DocumentList />
        </MainContent>
      } />
        <Route exact path="/documents/:id" render={() =>
          splitView ? (
            <Fragment>
              <MainContent span={8}>
                <DocumentList />
              </MainContent>
              <MainContent span={16}>
                <DocumentDetail />
              </MainContent>
            </Fragment>
          ) : (
            <MainContent>
              <DocumentDetail />
            </MainContent>
          )
        } />
    </Switch>
  </Fragment>
)

export default Documents
