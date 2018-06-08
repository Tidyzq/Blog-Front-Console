import { ComponentType } from 'react'
import { Omit } from '@/utils/tsHelper'

const withDefaultProps = <P extends {}, DP extends Partial<P> = Partial<P>>(
  defaultProps: DP,
  Cmp: ComponentType<P>,
) => {
  type RequiredProps = Omit<P, keyof DP>
  type Props = Partial<DP> & RequiredProps

  Cmp.defaultProps = defaultProps

  return (Cmp as ComponentType<any>) as ComponentType<Props>
}

export default withDefaultProps
