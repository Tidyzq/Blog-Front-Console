import React, { StatelessComponent, Fragment } from 'react'
import withTime, { WithTimeComponentProps } from '@/components/withTime'
import Moment from 'moment'

export interface TimeFromNowProps extends WithTimeComponentProps {
  date: number
}

const TimeFromNow: StatelessComponent<TimeFromNowProps> =
({ date }) => (
  <Fragment>
    {Moment(date).fromNow()}
  </Fragment>
)

export default withTime(
  30 * 1000, // update every half minute
)(TimeFromNow)
