import { document as documentAPI } from '@/api'
import { createThunkAction } from '@/utils/reduxHelper'
import { Document } from '@/models/types'
import { updateDocumentEntity } from './entities'

export const fetchDocuments = () => createThunkAction(async dispatch => {
  try {
    const { data: documents } = await documentAPI.getAll()
    for (const document of documents) {
      dispatch(updateDocumentEntity(document.id, document))
    }
    const idList = documents.map(({ id }) => id)
    // dispatch(updateDocumentList(idList))
    return idList
  } catch (e) {
    return []
  }
})

export const fetchDocument = (id: number) => createThunkAction(async dispatch => {
  try {
    const { data: document } = await documentAPI.getById(id)
    dispatch(updateDocumentEntity(id, document))
    return document
  } catch (e) {
    // do nothing
  }
  return undefined
})

export const createDocument = (document: Document) => createThunkAction(async dispatch => {
  try {
    const { data: returnedDocument } = await documentAPI.create(document)
    dispatch(updateDocumentEntity(returnedDocument.id, returnedDocument))
  } catch (e) {
    // do nothing
  }
})

export const updateDocument = (document: Document) => createThunkAction(async dispatch => {
  try {
    const { data: returnedDocument } = await documentAPI.update(document.id, document)
    dispatch(updateDocumentEntity(document.id, returnedDocument))
  } catch (e) {
    // do nothing
  }
})

export const deleteDocument = (id: number) => createThunkAction(async dispatch => {
  try {
    await documentAPI.delete(id)
    dispatch(updateDocumentEntity(id, undefined))
  } catch (e) {
    // do nothing
  }
})
