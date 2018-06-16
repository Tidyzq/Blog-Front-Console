import React, { StatelessComponent, Fragment, ReactNode } from 'react'
import { Route, Switch } from 'react-router-dom'

import MainContent from '@/views/MainContent'

export interface MasterDetailProps {
  splitView: boolean
  masterPath: string
  detailPath: string
  master: () => ReactNode
  detail: () => ReactNode
}

const MasterDetail: StatelessComponent<MasterDetailProps>
= ({ splitView, masterPath, master, detailPath, detail }) => (
  <Switch>
    <Route exact path={masterPath} render={() =>
      <MainContent>{master()}</MainContent>
    } />
    <Route exact path={detailPath} render={() =>
      <Fragment>
        {!splitView ? null : (
          <MainContent span={8}>{master()}</MainContent>
        )}
        <MainContent span={splitView ? 16 : 24}>{detail()}</MainContent>
      </Fragment>
    } />
  </Switch>
)

export default MasterDetail
