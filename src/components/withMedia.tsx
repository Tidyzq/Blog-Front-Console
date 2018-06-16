import React, { PureComponent, ComponentType } from 'react'
import { Bind } from 'lodash-decorators'

import { Omit } from '@/utils/tsHelper'
import { MediaType, watchMedia } from '@/utils'

export interface MediaComponentProps {
  media: MediaType,
}

const withMedia = <P extends MediaComponentProps>(Comp: ComponentType<P>) => {
  type props = Omit<P, keyof MediaComponentProps>
  const mediaInfo = watchMedia()

  class WithMediaWrapper extends PureComponent<props, MediaComponentProps> {

    public state: MediaComponentProps = {
      media: mediaInfo.media,
    }

    public componentDidMount () {
      mediaInfo.addListener(this.updateMedia)
    }

    public componentWillUnmount () {
      mediaInfo.removeListener(this.updateMedia)
    }

    public render () {
      return <Comp media={this.state.media} {...this.props}/>
    }

    @Bind()
    private updateMedia (media: MediaType) {
      this.setState({
        media,
      })
    }
  }

  return WithMediaWrapper
}

export default withMedia
