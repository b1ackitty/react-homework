import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import type { JSX } from 'react/jsx-runtime'
import { toast } from 'sonner'
import { usePageQuery } from '@/hooks'
import supabase, { type Profile } from '@/libs/supabase'
import Navigation, { type Page } from './pages/common/navigation'
import ProfilePage from './pages/profile'
import SignInPage from './pages/sign-in'
import SignUpPage from './pages/sign-up'

const getUser = async (user: User) => {
  return supabase
    .from('profiles')
    .select('username, email, bio')
    .eq('id', user.id)
    .single()
}

export default function AppPage() {
  const page = usePageQuery<Page>('signup')
  const [user, setUser] = useState<Partial<Profile> | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ error, data }) => {
      if (error) {
        toast.error(
          `사용자 검색 오류 발생! ${error.status}:${error.name}:${error.message}`
        )
      } else {
        const { error: userProfileError, data: userProfile } = await getUser(
          data.user
        )

        if (userProfileError) {
          toast.error(
            `프로필 데이터 가져오기 오류 발생! ${userProfileError.message}`
          )
        } else {
          setUser(userProfile)
        }
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      switch (event) {
        case 'SIGNED_IN': {
          const user = session?.user
          if (user) {
            const { data } = await getUser(user)
            setUser(data)
          }
          break
        }
        case 'SIGNED_OUT':
          setUser(null)
          break
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  let renderPage: JSX.Element | null = null

  switch (page) {
    case 'signup':
      renderPage = <SignUpPage />
      break
    case 'signin':
      renderPage = <SignInPage />
      break
    case 'profile':
      renderPage = <ProfilePage user={user} />
      break
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="py-6 bg-white shadow">
        <h1 className="text-2xl font-bold text-center">Supabase 인증</h1>
      </header>
      <Navigation />
      <main>{renderPage}</main>
    </div>
  )
}
