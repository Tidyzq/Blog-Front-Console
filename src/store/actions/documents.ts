import { document as documentAPI } from '@/api'
import { Document } from '@/models'
import { fetchUser } from './users'
import { createThunkActionWithAccessToken } from './login'
import { updateDocumentEntity } from './entities'

export const fetchDocuments = () => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  try {
    const { data: documents } = await documentAPI.getAll(accessToken)

    documents.forEach(document => dispatch(updateDocumentEntity(document.id, document)))
    const authors = new Set(documents.map(({ author }) => author))
    authors.forEach(author => dispatch(fetchUser(author)))

    const idList = documents.map(({ id }) => id)
    return idList
  } catch (e) {
    throw e
  }
})

export const fetchDocument = (id: number) => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  try {
    const { data: document } = await documentAPI.getById(accessToken, id)
    dispatch(updateDocumentEntity(id, document))
    dispatch(fetchUser(document.author))
    return document
  } catch (e) {
    throw e
  }
})

export const createDocument = (document: Document) => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  try {
    const { data: returnedDocument } = await documentAPI.create(accessToken, document)
    dispatch(updateDocumentEntity(returnedDocument.id, returnedDocument))
    dispatch(fetchUser(returnedDocument.author))
    return returnedDocument
  } catch (e) {
    throw e
  }
})

export const updateDocument = (document: Document) => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  try {
    const { data: returnedDocument } = await documentAPI.update(accessToken, document.id, document)
    dispatch(updateDocumentEntity(document.id, returnedDocument))
    dispatch(fetchUser(returnedDocument.author))
  } catch (e) {
    throw e
  }
})

export const deleteDocument = (id: number) => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  try {
    await documentAPI.delete(accessToken, id)
    dispatch(updateDocumentEntity(id, undefined))
  } catch (e) {
    throw e
  }
})
