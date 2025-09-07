import NavLink, { type NavigationItem } from './nav-link'

export type Page = 'signup' | 'signin' | 'profile'

const PAGES: NavigationItem[] = [
  { path: 'signup', text: '회원가입' },
  { path: 'signin', text: '로그인' },
  { path: 'profile', text: '프로필' },
]

export default function Navigation() {
  return (
    <nav aria-label="내비게이션">
      <ul className="flex gap-4 justify-center mt-6 mb-4">
        {PAGES.map((page) => (
          <li key={page.path}>
            <NavLink item={page} />
          </li>
        ))}
      </ul>
    </nav>
  )
}
