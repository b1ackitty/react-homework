import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useToggleState } from '@/hooks'
import supabase, { Profile } from '@/libs/supabase'
import { navigate } from '@/utils'

interface Props {
  user: Partial<Profile> | null
}

type UpdataProfileForm = {
  username: string
  email: string
  password: string
  passwordCheck: string
  bio?: string
}

export default function ProfilePage({ user }: Props) {
  const [editProfile, { toggle: toggleEditProfile }] = useToggleState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdataProfileForm>({
    mode: 'onChange',
  })

  const [showPassword, { toggle: togglePassword }] = useToggleState(false)
  const [showPasswordCheck, { toggle: togglePasswordCheck }] =
    useToggleState(false)

  const onSubmit = async (formData: UpdataProfileForm) => {
    if (isSubmitting) return

    const { error, data } = await supabase.auth.updateUser({
      email: formData.email,
      password: formData.password,
      data: {
        username: formData.username,
        bio: formData.bio,
      },
    })

    if (error) {
      toast.error(
        `프로필 수정 오류 발생! ${error.status}:${error.name}:${error.message}`
      )
    } else {
      if (data.user) {
        const { error } = await supabase.from('profiles').update({
          id: data.user.id,
          username: data.user.user_metadata.username,
          email: data.user.user_metadata.email,
          bio: data.user.user_metadata.bio,
          updated_at: new Date().toISOString(),
        })

        if (error) {
          toast.error(
            `프로필 테이블 수정 오류 발생! ${error.code}:${error.name}${error.message}`
          )
        } else {
          toast.success('프로필 수정에 성공했습니다!')
          toggleEditProfile()
          navigate('profile')
          reset()
        }
      }
    }
  }

  const password = watch('password')

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-xl font-bold mb-6 text-center">프로필</h2>
      {user ? (
        editProfile ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            aria-label="프로필 수정 폼"
            autoComplete="off"
            noValidate
          >
            <div className="mb-2 flex gap-1 items-center">
              <label htmlFor="update-username">이름: </label>
              <input
                type="text"
                id="update-username"
                autoComplete="off"
                value={user.username ? user.username : ''}
                aria-invalid={!!errors.username}
                aria-describedby={
                  errors.username ? 'update-username-error' : undefined
                }
                {...register('username', { required: '이름을 입력하세요' })}
                className={`grow px-3 py-2 border rounded focus:outline-none focus:ring ${
                  errors.username
                    ? 'border-red-500 ring-red-300'
                    : 'border-gray-300 focus:ring-cyan-300'
                }`}
              />
              {errors.username && (
                <div
                  role="alert"
                  id="update-username-error"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.username.message}
                </div>
              )}
            </div>
            <div className="mb-2">
              <label htmlFor="update-email" className="block font-medium mb-1">
                이메일
              </label>
              <input
                type="email"
                id="update-email"
                autoComplete="off"
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? 'update-email-error' : undefined
                }
                {...register('email', {
                  required: '이메일을 입력하세요',
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: '올바른 이메일 형식이 아닙니다',
                  },
                })}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                  errors.email
                    ? 'border-red-500 ring-red-300'
                    : 'border-gray-300 focus:ring-cyan-300'
                }`}
              />
              {errors.email && (
                <div
                  id="update-email-error"
                  className="text-red-500 text-sm mt-1"
                  role="alert"
                >
                  {errors.email.message}
                </div>
              )}
            </div>
            <div className="mb-2">
              <label
                htmlFor="update-password"
                className="block font-medium mb-1"
              >
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="update-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="off"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? 'update-password-error' : undefined
                  }
                  {...register('password', {
                    required: '비밀번호를 입력하세요',
                    minLength: {
                      value: 6,
                      message: '6자 이상 입력하세요',
                    },
                    validate: (value: string) => {
                      if (!/[a-z]/.test(value))
                        return '영문 소문자가 한 자 이상 포함되어야 합니다'
                      if (!/[A-Z]/.test(value))
                        return '영문 대문자가 한 자 이상 포함되어야 합니다'
                      if (!/[0-9]/.test(value))
                        return '숫자가 한 개 이상 포함되어야 합니다'
                    },
                  })}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring pr-12 ${
                    errors.password
                      ? 'border-red-500 ring-red-300'
                      : 'border-gray-300 focus:ring-cyan-300'
                  }`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? '비밀번호 감춤' : '비밀번호 표시'}
                  title={showPassword ? '비밀번호 감춤' : '비밀번호 표시'}
                  aria-pressed={showPassword}
                  className="cursor-pointer absolute right-2 top-2 px-2 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring focus:ring-cyan-300"
                  onClick={togglePassword}
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              {errors.password && (
                <div
                  id="update-password-error"
                  className="text-red-500 text-sm mt-1"
                  role="alert"
                >
                  {errors.password.message}
                </div>
              )}
            </div>
            <div className="mb-2">
              <label
                htmlFor="update-password-check"
                className="block font-medium mb-1"
              >
                비밀번호 확인
              </label>
              <div className="relative">
                <input
                  id="update-password-check"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="off"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? 'update-password-check-error' : undefined
                  }
                  {...register('passwordCheck', {
                    required: '비밀번호 확인을 입력하세요',
                    validate: (v: string) =>
                      v === password || '비밀번호가 일치하지 않습니다',
                  })}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring pr-12 ${
                    errors.password
                      ? 'border-red-500 ring-red-300'
                      : 'border-gray-300 focus:ring-cyan-300'
                  }`}
                />
                <button
                  type="button"
                  aria-label={
                    showPasswordCheck ? '비밀번호 감춤' : '비밀번호 표시'
                  }
                  title={showPasswordCheck ? '비밀번호 감춤' : '비밀번호 표시'}
                  aria-pressed={showPasswordCheck}
                  className="cursor-pointer absolute right-2 top-2 px-2 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring focus:ring-cyan-300"
                  onClick={togglePasswordCheck}
                >
                  {showPasswordCheck ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              {errors.passwordCheck && (
                <div
                  id="update-password-check-error"
                  className="text-red-500 text-sm mt-1"
                  role="alert"
                >
                  {errors.passwordCheck.message}
                </div>
              )}
            </div>
            <div className="mb-2">
              <label htmlFor="update-bio" className="block font-medium mb-1">
                소개(선택)
              </label>
              <textarea
                id="update-bio"
                autoComplete="off"
                aria-describedby={errors.bio ? 'update-bio-error' : undefined}
                {...register('bio')}
                rows={3}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring border-gray-300 focus:ring-cyan-300 resize-none"
                placeholder="자신을 간단히 소개해 주세요"
              />
              {errors.bio && (
                <div
                  id="update-bio-error"
                  className="text-red-500 text-sm mt-1"
                  role="alert"
                >
                  {errors.bio.message}
                </div>
              )}
            </div>
            <button
              type="submit"
              aria-disabled={isSubmitting}
              className="cursor-pointer w-full bg-cyan-600 text-white py-2 rounded transition hover:bg-cyan-700 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            >
              {isSubmitting ? '가입 중...' : '프로필 저장'}
            </button>
            <button
              type="button"
              onClick={async () => {
                const { error } = await supabase.auth.signOut()

                if (!error) {
                  toast.success('성공적으로 로그아웃 되었습니다')
                  navigate('signin')
                } else {
                  toast.error(
                    `로그아웃 오류 발생! ${error.status}:${error.name}:${error.message}`
                  )
                }
              }}
              className="w-full mt-4 bg-gray-200 py-2 rounded hover:bg-gray-300 transition"
            >
              로그아웃
            </button>
          </form>
        ) : (
          <div>
            <div className="mb-2 flex gap-1 items-center">
              <span className="font-medium py-2.25">이름:</span>{' '}
              {user.username || '-'}
            </div>
            <div className="mb-2">
              <span className="font-medium py-2.25">이메일:</span>{' '}
              {user.email || '-'}
            </div>
            <div className="mb-2">
              <span className="font-medium py-2.25">소개:</span>{' '}
              {user.bio || '-'}
            </div>
            <button
              type="button"
              onClick={async () => {
                toggleEditProfile()
              }}
              className="cursor-pointer w-full bg-cyan-600 text-white py-2 rounded transition hover:bg-cyan-700 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            >
              프로필 수정
            </button>
            <button
              type="button"
              onClick={async () => {
                const { error } = await supabase.auth.signOut()

                if (!error) {
                  toast.success('성공적으로 로그아웃 되었습니다')
                  navigate('signin')
                } else {
                  toast.error(
                    `로그아웃 오류 발생! ${error.status}:${error.name}:${error.message}`
                  )
                }
              }}
              className="w-full mt-4 bg-gray-200 py-2 rounded hover:bg-gray-300 transition"
            >
              로그아웃
            </button>
          </div>
        )
      ) : (
        <div className="text-center text-gray-500">
          프로필을 보려면 로그인이 필요합니다.
        </div>
      )}
    </div>
  )
}
