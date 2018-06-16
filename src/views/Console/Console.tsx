import React, { StatelessComponent } from 'react'
import { Layout } from 'antd'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import { MediaType } from '@/utils'
import ErrorBoundary from '@/components/ErrorBoundary'
import AuthorizationBoundary from '@/components/AuthorizationBoundary'
import withMedia from '@/components/withMedia'
import Documents from '@/views/Documents'
import Users from '@/views/Users'
import Editor from '@/views/Editor'
import MainContent from '@/views/MainContent'
import Sidebar from '@/views/Sidebar'
import Header from '@/views/Header'
import Login from '@/views/Login'
import styles from './Console.scss'

const { Content } = Layout

export interface ConsoleProps {
  media: MediaType,
}

const mediaShouldCollapse = (media: MediaType) => media <= MediaType.md

const mediaShouldShowSplitView = (media: MediaType) => media >= MediaType.lg

const Console: StatelessComponent<ConsoleProps> = ({ media }) => {
  const collapsed = mediaShouldCollapse(media)
  const splitView = mediaShouldShowSplitView(media)
  return (
    <ErrorBoundary>
      <BrowserRouter basename="/console">
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route render={() =>
            <AuthorizationBoundary
              unauthorized={() =>
                <Redirect to="/login" />
              }
            >
              <Layout
                className={styles.main_layout}
              >
                <Sidebar
                  collapsed={collapsed}
                />
                <Layout>
                  <Header />
                  <Content style={{ minHeight: '0', overflow: 'auto', display: 'flex' }}>
                    <Route exact path="/" render={() =>
                      <MainContent>
                        <p>hello world</p>
                      </MainContent>
                    } />
                    <Route path="/users" render={() =>
                      <Users splitView={splitView}/>
                    }/>
                    <Route path="/documents" render={() =>
                      <Documents splitView={splitView}/>
                    } />
                    <Route path="/editor/:id?" render={() =>
                      <Editor splitView={splitView}/>
                    } />
                    <Route path="/tags" render={() =>
                      <MainContent>
                        <p>4</p>
                      </MainContent>
                    } />
                    <Route path="/settings" render={() =>
                      <MainContent>
                        <p>5</p>
                      </MainContent>
                    } />
                  </Content>
                </Layout>
              </Layout >
            </AuthorizationBoundary>
          } />
        </Switch>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default withMedia(
  Console,
)
