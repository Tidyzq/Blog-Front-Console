import React, { PureComponent } from 'react'
import { Layout } from 'antd'
import { Bind } from 'lodash-decorators'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { MediaType, watchMedia } from '@/utils'
import Documents from './Documents/index'
import Editor from './Editor'
import Authorization from './Authorization'
import MainContent from './MainContent'
import Sidebar from './Sidebar'
import Header from './Header'
import Login from './Login'
import styles from './index.scss'

const { Content } = Layout

export interface IConsoleProps { }

export interface IConsoleState {
  collapsed: boolean,
  media: MediaType,
}

class Console extends PureComponent<IConsoleProps, IConsoleState> {

  public mediaInfo = watchMedia()

  public state: IConsoleState = {
    collapsed: this.mediaShouldCollapse(this.mediaInfo.media),
    media: this.mediaInfo.media,
  }

  public componentWillMount () {
    this.mediaInfo.addListener(this.updateMedia)
  }

  public componentWillUnmount () {
    this.mediaInfo.removeListener(this.updateMedia)
  }

  public render () {
    const { collapsed, media } = this.state
    return (
      <BrowserRouter basename="/console">
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route render={() =>
            <Authorization>
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
                      <MainContent>
                        <p>2</p>
                      </MainContent>
                    }/>
                    <Route path="/documents" render={() =>
                      <Documents splitView={!this.mediaShouldCollapse(media)}/>
                    } />
                    <Route path="/editor/:id" render={() =>
                      <Editor />
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
            </Authorization>
          } />
        </Switch>
      </BrowserRouter>
    )
  }

  private mediaShouldCollapse (media: MediaType) {
    return media <= MediaType.sm
  }

  @Bind()
  private updateMedia (media: MediaType) {
    const { media: oldMedia } = this.state
    this.setState({
      media,
    })
    if (this.mediaShouldCollapse(media) && !this.mediaShouldCollapse(oldMedia)) {
      this.setState({
        collapsed: true,
      })
    } else if (this.mediaShouldCollapse(oldMedia) && !this.mediaShouldCollapse(media)) {
      this.setState({
        collapsed: false,
      })
    }
  }
}

export default Console
