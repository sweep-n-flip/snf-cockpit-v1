import nextPayloadCMS from '../config'

export const getPages = async (options?: Partial<Parameters<typeof nextPayloadCMS.find>[0]>) => {
  try {
    const result = await nextPayloadCMS.find({
      ...(options || {}),
      collection: 'pages',
    })

    const data = result.docs

    return data
  } catch {
    return []
  }
}

export const getPage = async (options?: Partial<Parameters<typeof nextPayloadCMS.find>[0]>) => {
  try {
    const docs = await getPages(options)

    if (docs.length > 0) {
      return docs[0]
    }

    return null
  } catch {
    return null
  }
}
