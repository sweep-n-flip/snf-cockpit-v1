import axios from 'axios'

export const fetcherRest = async <T>(url: string) => {
  const { data } = await axios.get<{ docs: T[] }>(url)

  return data.docs
}
