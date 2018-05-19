import React, { StatelessComponent } from 'react'
import { Layout, Menu } from 'antd'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '@/store/actions/login'
import Icon from '@/components/Icon'
import styles from './index.scss'

const { Sider, Header, Content, Footer } = Layout

export interface ISidebarProps extends RouteComponentProps<any> {
  collapsed: boolean
  logout: () => any
}

const Sidebar = (({ collapsed, location, logout }) => (
  <Sider
    trigger={null}
    collapsible
    collapsedWidth="60"
    collapsed={collapsed}
    defaultCollapsed={collapsed}
  >
    <Layout className={styles.layout}>
      <Header style={{ padding: 0 }}>
        <div className={styles.logo} />
        <p>{collapsed}</p>
      </Header>
      <Content>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[ location.pathname ]}
        >
          <Menu.Item key="/users">
            <Link to="/users">
              <Icon type="users" />
              <span>Users</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/documents">
            <Link to="/documents">
              <Icon type="book" />
              <span>Documents</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/tags">
            <Link to="/tags">
              <Icon type="tags" />
              <span>Tags</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/settings">
            <Link to="/settings">
              <Icon type="cogs" />
              <span>Settings</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Content>
      <Footer className={styles.footer}>
        <Menu
          theme="dark"
          mode="inline"
          selectable={false}
        >
          <Menu.Item key="logout">
            <a onClick={() => logout()}>
              <Icon type="sign-out" />
              <span>Logout</span>
            </a>
          </Menu.Item>
          {/* <Menu.Item key="/documents">
            <Link to="/documents">
              <Icon type="book" />
              <span>Documents</span>
            </Link>
          </Menu.Item> */}
        </Menu>
      </Footer>
    </Layout>
  </Sider>
)) as StatelessComponent<ISidebarProps>

export default withRouter(connect(undefined, { logout })(Sidebar))
