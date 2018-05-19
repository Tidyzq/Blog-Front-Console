import React, { StatelessComponent, Fragment } from 'react'
import { Route, Switch, Link } from 'react-router-dom'
import MainContent from '../MainContent'
import DocumentList from '../DocumentList/index'
import DocumentDetail from '../DocumentDetail/index'
import Header from '../Header'

export interface IDocumentProps {
  splitView: boolean
}

const Documents: StatelessComponent<IDocumentProps>
= ({ splitView }) => (
  <Fragment>
    <Header.Portal>
      <Header.Breadcrumb>
        <Route path="/documents" render={() =>
          <Header.Breadcrumb.Item>
            <Link to="/documents">Documents</Link>
          </Header.Breadcrumb.Item>
        } />
        <Route path="/documents/:id" render={({ match }) =>
          <Header.Breadcrumb.Item>{match.params.id}</Header.Breadcrumb.Item>
        } />
      </Header.Breadcrumb>
    </Header.Portal>
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
