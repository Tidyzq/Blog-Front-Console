import { document as documentAPI } from '@/api'
import { Document } from '@/models'
import { createThunkAction } from '@/utils/redux'

import { fetchUser } from './users'
import { createThunkActionWithAccessToken } from './login'
import { updateDocumentEntity, updateTagEntity } from './entities'
import { updateDocumentToTagsRelation } from './relations'

export const fetchDocumentAuthor = (id: number) => createThunkAction(dispatch => dispatch(fetchUser(id)))

export const fetchDocumentTags = (id: number) => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  const { data: tags } = await documentAPI.Tag.getAll(accessToken, id)
  tags.forEach(tag => dispatch(updateTagEntity(tag.id, tag)))
  const tagIds = tags.map(tag => tag.id)
  dispatch(updateDocumentToTagsRelation(id, tagIds))
  return tagIds
})

export const fetchDocuments = () => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  const { data: documents } = await documentAPI.getAll(accessToken)

  documents.forEach(document => {
    dispatch(updateDocumentEntity(document.id, document))
    dispatch(fetchDocumentAuthor(document.author))
    // dispatch(fetchDocumentTags(document.id))
  })

  const idList = documents.map(({ id }) => id)
  return idList
})

export const fetchDocument = (id: number) => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  const [ tags, { data: document } ] = await Promise.all([
    dispatch(fetchDocumentTags(id)),
    documentAPI.getById(accessToken, id),
  ])
  dispatch(updateDocumentEntity(document.id, document))
  const author = await fetchDocumentAuthor(document.author)
  return { document, author, tags }
})

export const createDocument = (document: Document) => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  const { data: returnedDocument } = await documentAPI.create(accessToken, document)
  dispatch(updateDocumentEntity(document.id, document))
  return returnedDocument
})

export const updateDocument = (document: Document) => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  const { data: returnedDocument } = await documentAPI.update(accessToken, document.id, document)
  dispatch(updateDocumentEntity(returnedDocument.id, returnedDocument))
})

export const updateDocumentTags = (id: number, tagIds: number[]) => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  dispatch(updateDocumentToTagsRelation(id, tagIds))
  await documentAPI.Tag.update(accessToken, id, tagIds)
})

export const deleteDocument = (id: number) => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  await documentAPI.delete(accessToken, id)
  dispatch(updateDocumentEntity(id, undefined))
})
