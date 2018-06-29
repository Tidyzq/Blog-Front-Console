import { tag as tagAPI } from '@/api'
import { Tag } from '@/models'
import { createThunkActionWithAccessToken } from './login'
import { updateDocumentEntity, updateTagEntity } from './entities'
import { updateTagToDocumentsRelation } from './relations'

export const fetchTagDocuments = (id: number) => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  const { data: documents } = await tagAPI.Document.getAll(accessToken, id)
  documents.forEach(document => dispatch(updateDocumentEntity(document.id, document)))
  const documentIds = documents.map(document => document.id)
  dispatch(updateTagToDocumentsRelation(id, documentIds))
  return documentIds
})

export const fetchTags = () => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  const { data: tags } = await tagAPI.getAll(accessToken)
  tags.forEach(tag => dispatch(updateTagEntity(tag.id, tag)))
  return tags.map(tag => tag.id)
})

export const fetchTag = (id: number) => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  const [ { data: tag }, documents ] = await Promise.all([
    tagAPI.getById(accessToken, id),
    dispatch(fetchTagDocuments(id)),
  ])
  dispatch(updateTagEntity(tag.id, tag))
  return { tag, documents }
})

export const createTag = (tag: Tag) => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  const { data: returnedTag } = await tagAPI.create(accessToken, tag)
  dispatch(updateTagEntity(returnedTag.id, returnedTag))
})

export const updateTag = (tag: Tag) => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  const { data: returnedTag } = await tagAPI.updateById(accessToken, tag.id, tag)
  dispatch(updateTagEntity(returnedTag.id, returnedTag))
})

export const deleteTag = (id: number) => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  await tagAPI.deleteById(accessToken, id)
  dispatch(updateTagEntity(id, undefined))
})
