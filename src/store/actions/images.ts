import { image as imageAPI } from '@/api'
// import { createThunkAction } from '@/utils/redux'
import { Image } from '@/models'

import { createThunkActionWithAccessToken } from './login'

export const fetchImages = () => createThunkActionWithAccessToken(async accessToken => {
  const images = await imageAPI.getAll(accessToken)
  return images
})

export const createImages = (files: File[], onProgress?: (progress: number) => any) => createThunkActionWithAccessToken(accessToken => {
  return imageAPI.create(accessToken, files, onProgress)
})

export const deleteImage = (image: Image) => createThunkActionWithAccessToken(accessToken => {
  return imageAPI.delete(accessToken, image)
})
