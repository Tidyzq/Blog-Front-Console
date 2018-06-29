import React, { ComponentType, StatelessComponent } from 'react'
import { getDisplayName } from '@/utils/react'

const withComputedProps = <CP extends {}, OP extends {}>(getComputedProps: (ownProps: OP) => CP) =>
<P extends OP>(Comp: ComponentType<P>) => {
  const ComputedComp: StatelessComponent<Omit<P, Extract<keyof P, keyof CP>> & OP> =
    props => <Comp {...props} {...getComputedProps(props)} />
  ComputedComp.displayName = `withComputedProps(${getDisplayName(Comp)})`
  return ComputedComp
}

export default withComputedProps
