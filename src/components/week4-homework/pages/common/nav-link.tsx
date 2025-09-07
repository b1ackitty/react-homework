import type { MouseEvent } from 'react'
import { navigate } from '@/utils'
import { Page } from './navigation'

export interface NavigationItem {
  path: Page
  text: string
}

interface Props {
  item: NavigationItem
}

export default function NavLink({ item }: Props) {
  const { path, text } = item

  const handleLink = (page: Page) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    const aElement = e.target as HTMLAnchorElement

    if (aElement.getAttribute('aria-disabled') === 'true') return

    navigate(page)
  }

  return (
    <a
      href={`/?page=${path}`}
      onClick={handleLink(path)}
      className="px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-100 transition"
    >
      {text}
    </a>
  )
}
