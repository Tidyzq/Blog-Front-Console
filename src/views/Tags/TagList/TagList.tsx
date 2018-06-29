import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { List } from 'antd'

import { Tag } from '@/models'
import { State } from '@/store'
import { fetchTags } from '@/store/actions/tags'

import TagListItem from './Item'
import { tagsSelector } from './selector'

export interface TagListProps {
  tags: { [id: number]: Tag | undefined },
  fetchTags: typeof fetchTags,
}

export interface TagListState {
  tagIdList: number[],
}

class TagList extends PureComponent<TagListProps, TagListState> {

  public state: TagListState = {
    tagIdList: [],
  }

  public async componentDidMount () {
    const { fetchTags } = this.props
    const tagIdList = await fetchTags()
    this.setState({ tagIdList })
  }

  public render () {
    const { tagIdList } = this.state
    const { tags } = this.props
    return (
      <List itemLayout="horizontal" dataSource={undefined} renderItem={undefined}>
        {tagIdList.map(id => {
          const tag = tags[id]
          if (!tag) return null
          return (
            <TagListItem key={tag.id} tag={tag} />
          )
        }).filter(Boolean)}
      </List>
    )
  }
}

export default connect((state: State) => ({
  tags: tagsSelector(state),
}), {
  fetchTags,
})(TagList)
