import React, { Component, ErrorInfo } from 'react'

export interface ErrorBoundaryProps {}

export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  info: ErrorInfo | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {

  public state = {
    hasError: false,
    error: null,
    info: null,
  }

  public componentDidCatch (error: Error, info: ErrorInfo) {
    this.setState({
      hasError: true,
      error,
      info,
    })
  }

  public render () {
    if (this.state.hasError) {
      const error = this.state.error!
      const info = this.state.info!
      // You can render any custom fallback UI
      return (
        <div style={{ color: 'red' }}>
          <p>{error}</p>
          <p>{info}</p>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
