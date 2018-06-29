import { ComponentType } from 'react'

const withDefaultProps = <DP extends {}>(
  defaultProps: DP,
) => <P extends DP>(
  Cmp: ComponentType<P>,
) => {
  Cmp.defaultProps = defaultProps

  return (Cmp as ComponentType<any>) as ComponentType<Partial<Pick<P, keyof DP>> & Omit<P, keyof DP>>
}

export default withDefaultProps
