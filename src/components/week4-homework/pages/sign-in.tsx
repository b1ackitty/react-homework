import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useToggleState } from '@/hooks'
import supabase from '@/libs/supabase'
import { navigate } from '@/utils'

type LoginForm = {
  email: string
  password: string
}

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginForm>({
    mode: 'onChange',
  })

  const [showPassword, { toggle }] = useToggleState(false)

  const onSubmit = async (formData: LoginForm) => {
    if (isSubmitting) return

    const { error, data } = await supabase.auth.signInWithPassword(formData)

    if (error) {
      toast.error(
        `로그인 오류 발생! ${error.status}:${error.name}:${error.message}`
      )
    } else {
      if (data.user) {
        const { username } = data.user.user_metadata
        toast.success(`${username}! 로그인에 성공했습니다!`, {
          action: {
            label: '프로필 페이지로 이동',
            onClick: () => {
              navigate('profile')
              reset()
            },
          },
        })
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-xl font-bold mb-6 text-center">로그인</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        aria-label="로그인 폼"
        autoComplete="off"
        noValidate
      >
        <div className="mb-4">
          <label htmlFor="login-email" className="block font-medium mb-1">
            이메일
          </label>
          <input
            type="text"
            id="login-email"
            autoComplete="off"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            {...register('email', {
              required: '이름 또는 이메일을 입력하세요',
            })}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
              errors.email
                ? 'border-red-500 ring-red-300'
                : 'border-gray-300 focus:ring-cyan-300'
            }`}
          />
          {errors.email && (
            <div
              id="login-email-error"
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.email.message}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="login-password" className="block font-medium mb-1">
            비밀번호
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="login-password"
              autoComplete="off"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? 'login-password-error' : undefined
              }
              {...register('password', {
                required: '비밀번호를 입력하세요',
              })}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                errors.password
                  ? 'border-red-500 ring-red-300'
                  : 'border-gray-300 focus:ring-cyan-300'
              }`}
            />
            <button
              type="button"
              onClick={toggle}
              className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition focus:outline-none focus:ring focus:ring-cyan-300"
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
              title={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          {errors.password && (
            <div
              id="login-password-error"
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.password.message}
            </div>
          )}
        </div>
        <button
          type="submit"
          aria-disabled={isSubmitting}
          className="cursor-pointer w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 transition aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        >
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  )
}
