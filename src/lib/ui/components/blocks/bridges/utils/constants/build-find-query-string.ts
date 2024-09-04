function buildFindQueryString(params: Record<string, any>): string {
  const parts: string[] = []

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'object') {
      for (const [subKey, subValue] of Object.entries(value)) {
        parts.push(`where[${key}][${subKey}]=${encodeURIComponent(String(subValue))}`)
      }
    } else {
      parts.push(`${key}=${encodeURIComponent(value)}`)
    }
  }

  return parts.join('&')
}

export default buildFindQueryString
