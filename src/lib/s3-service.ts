import { S3Item } from '@/types/s3-types'
import { v4 as uuidv4 } from 'uuid'

export const uploadFile = async (
  file: File,
  userId: string
): Promise<S3Item> => {
  const fileUuid = uuidv4()
  const key = `${userId}/${fileUuid}/${file.name}`

  const formData = new FormData()
  formData.append('file', file)
  formData.append('key', key)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()
  if (data.success) {
    return {
      key: key,
      url: data.url,
      lastModified: new Date(),
      size: file.size,
      uuid: fileUuid,
      proofHash: data.proofHash,
    }
  } else {
    throw new Error(data.message)
  }
}

export const fetchUserItems = async (userId: string): Promise<S3Item[]> => {
  const response = await fetch(`/api/s3-items?userId=${userId}`)
  const data = await response.json()
  if (data.success) {
    return data.items
  } else {
    throw new Error(data.message)
  }
}

export const fetchItemById = async (
  userId: string,
  fileUuid: string
): Promise<S3Item> => {
  const response = await fetch(
    `/api/s3-items?userId=${userId}&fileUuid=${fileUuid}`
  )
  const data = await response.json()
  if (data.success) {
    return data.item
  } else {
    throw new Error(data.message)
  }
}
