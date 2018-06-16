import { ComponentType } from 'react'
import { Omit } from '@/utils/tsHelper'

const withDefaultProps = <DP extends {}>(
  defaultProps: DP,
) => <P extends {}>(
  Cmp: ComponentType<P>,
) => {
  Cmp.defaultProps = defaultProps

  return (Cmp as ComponentType<any>) as ComponentType<Partial<DP> & Omit<P, keyof DP>>
}

export default withDefaultProps
