import { ComponentType } from 'react'

export function getDisplayName <P extends {}> (Comp: ComponentType<P>): string {
  return Comp.displayName || Comp.name || 'Component'
}
