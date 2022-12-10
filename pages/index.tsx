import type { User } from '../interfaces'
import useSwr from 'swr'
import Link from 'next/link'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Index() {
  const { data, error } = useSwr<User[]>('/api/users', fetcher)

  if (error) return "Failed to load users"
  if (!data) return "Loading..."

  return data
}
