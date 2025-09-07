import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useToggleState } from '@/hooks'
import supabase from '@/libs/supabase'
import { navigate } from '@/utils'

type SignUpForm = {
  username: string
  email: string
  password: string
  passwordCheck: string
  bio?: string
}

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpForm>({
    mode: 'onChange',
  })

  const [showPassword, { toggle: togglePassword }] = useToggleState(false)
  const [showPasswordCheck, { toggle: togglePasswordCheck }] =
    useToggleState(false)

  const onSubmit = async (formData: SignUpForm) => {
    if (isSubmitting) return

    const { error, data } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          username: formData.username,
          bio: formData.bio,
        },
      },
    })

    if (error) {
      toast.error(
        `회원가입 인증 오류 발생! ${error.status}:${error.name}:${error.message}`
      )
    } else {
      if (data.user) {
        const { error } = await supabase.from('profiles').insert({
          id: data.user.id,
          username: data.user.user_metadata.username,
          email: data.user.user_metadata.email,
          bio: data.user.user_metadata.bio,
          created_at: new Date().toISOString(),
        })

        if (error) {
          toast.error(
            `프로필 테이블 추가 오류 발생! ${error.code}:${error.name}${error.message}`
          )
        } else {
          toast.success('회원가입에 성공했습니다!')
          navigate('signin')
          reset()
        }
      }
    }
  }

  const password = watch('password')

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-xl font-bold mb-6 text-center">회원가입</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        aria-label="회원가입 폼"
        autoComplete="off"
        noValidate
      >
        <div className="mb-4">
          <label htmlFor="signup-username">이름</label>
          <input
            type="text"
            id="signup-username"
            autoComplete="off"
            aria-invalid={!!errors.username}
            aria-describedby={
              errors.username ? 'signup-username-error' : undefined
            }
            {...register('username', { required: '이름을 입력하세요' })}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
              errors.username
                ? 'border-red-500 ring-red-300'
                : 'border-gray-300 focus:ring-cyan-300'
            }`}
          />
          {errors.username && (
            <div
              role="alert"
              id="signup-username-error"
              className="text-red-500 text-sm mt-1"
            >
              {errors.username.message}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="signup-email" className="block font-medium mb-1">
            이메일
          </label>
          <input
            type="email"
            id="signup-email"
            autoComplete="off"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'signup-email-error' : undefined}
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
              id="signup-email-error"
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.email.message}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="signup-password" className="block font-medium mb-1">
            비밀번호
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="off"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? 'signup-password-error' : undefined
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
              id="signup-password-error"
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.password.message}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="signup-password-check"
            className="block font-medium mb-1"
          >
            비밀번호 확인
          </label>
          <div className="relative">
            <input
              id="signup-password-check"
              type={showPassword ? 'text' : 'password'}
              autoComplete="off"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? 'signup-password-check-error' : undefined
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
              aria-label={showPasswordCheck ? '비밀번호 감춤' : '비밀번호 표시'}
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
              id="signup-password-check-error"
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.passwordCheck.message}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="signup-bio" className="block font-medium mb-1">
            소개(선택)
          </label>
          <textarea
            id="signup-bio"
            autoComplete="off"
            aria-describedby={errors.bio ? 'signup-bio-error' : undefined}
            {...register('bio')}
            rows={3}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring border-gray-300 focus:ring-cyan-300 resize-none"
            placeholder="자신을 간단히 소개해 주세요"
          />
          {errors.bio && (
            <div
              id="signup-bio-error"
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
          {isSubmitting ? '가입 중...' : '회원가입'}
        </button>
      </form>
    </div>
  )
}
