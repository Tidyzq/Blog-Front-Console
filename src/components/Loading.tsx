import React, { StatelessComponent } from 'react'
import { LoadingComponentProps } from 'react-loadable'

export interface LoadingProps extends LoadingComponentProps { }

const Loading: StatelessComponent<LoadingProps> = ({ error, retry, timedOut, pastDelay }) => {
  if (error) {
    return <div>{error.message} <button onClick={retry}>Retry</button><p>{error.stack}</p></div>
  } else if (timedOut) {
    return <div>Taking a long time... <button onClick={retry}>Retry</button></div>
  } else if (pastDelay) {
    return <div>Loading...</div>
  } else {
    return null
  }
}

export default Loading
