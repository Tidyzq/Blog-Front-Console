import React, { PureComponent } from 'react'
import { Layout } from 'antd'
import { Bind } from 'lodash-decorators'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { MediaType, watchMedia } from '@/utils'
import Documents from '@/views/Documents'
import Editor from '@/views/Editor'
import Authorization from '@/views/Authorization'
import MainContent from '@/views/MainContent'
import Sidebar from '@/views/Sidebar'
import Header from '@/views/Header'
import Login from '@/views/Login'
import styles from './Console.scss'

const { Content } = Layout

export interface ConsoleProps { }

export interface ConsoleState {
  collapsed: boolean,
  media: MediaType,
}

class Console extends PureComponent<ConsoleProps, ConsoleState> {

  public mediaInfo = watchMedia()

  public state: ConsoleState = {
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
