import React, { ComponentType, PureComponent } from 'react'
import { connect } from 'react-redux'

import { Setting } from '@/models'
import { State } from '@/store'
import { fetchSettings } from '@/store/actions/settings'

export interface WithSettingsComponentProps {
  settings: Setting | {}
  fetchSettings: typeof fetchSettings
}

const withSettings = <P extends WithSettingsComponentProps>(Comp: ComponentType<P>) => {
  class WithSettingsWrapper extends PureComponent<P> {

    public componentDidMount () {
      const { fetchSettings } = this.props
      fetchSettings()
    }

    public render () {
      return <Comp {...this.props} />
    }
  }
  return connect((state: State) => ({
    settings: state.settings,
  }), {
    fetchSettings,
  })(WithSettingsWrapper as ComponentType<any>)
}

export default withSettings
