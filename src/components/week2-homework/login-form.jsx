import { useState } from 'react'
import LoginButton from './login-button'
import LoginCheckbox from './login-checkbox'
import LoginInput from './login-input'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)

  const validateEmail = (email) => {
    const emailRegularExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegularExpression.test(email)
  }

  const validatePassword = (password) => {
    const passwordRegularExpression = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6}$/
    return passwordRegularExpression.test(password)
  }

  const handleEmailChange = ({ target }) => {
    const value = target.value
    setEmail(value)

    if (value && !validateEmail(value)) {
      setEmailError('아이디(이메일)는 이메일 형식으로 입력해 주세요.')
    } else {
      setEmailError('')
    }
  }

  const handlePasswordChange = ({ target }) => {
    const value = target.value
    setPassword(value)

    if (value && !validatePassword(value)) {
      setPasswordError('숫자, 영어 조합 6자리 이상 입력해야 합니다.')
    } else {
      setPasswordError('')
    }
  }

  const handleKeepLoginChange = ({ target }) => setKeepLoggedIn(target.checked)

  const handleLogin = () => {
    if (!email) {
      setEmailError('아이디(이메일)를 입력해 주세요.')
    } else if (!validateEmail(email)) {
      setEmailError('아이디(이메일)는 이메일 형식으로 입력해 주세요.')
    }

    if (!password) {
      setPasswordError('비밀번호를 입력해 주세요.')
    } else if (!validatePassword(password)) {
      setPasswordError('숫자, 영어 조합 6자리 이상 입력해야 합니다.')
    }
  }

  const isFormValid = email && password && !emailError && !passwordError

  return (
    <form className="w-xl flex flex-col gap-5">
      <LoginInput
        type="email"
        value={email}
        onChange={handleEmailChange}
        error={emailError}
      />
      <LoginInput
        type="password"
        value={password}
        onChange={handlePasswordChange}
        error={passwordError}
      />
      <div className="flex justify-between">
        <LoginCheckbox
          keepLoggedIn={keepLoggedIn}
          onChange={handleKeepLoginChange}
        />
        <a href="#" rel="noopener noreferrer" className="text-[#0074e9]">
          아이디(이메일)/비밀번호 찾기
          <img
            src="/week2-homework/chevron.svg"
            alt=""
            width={8}
            height={16}
            className="inline ml-1.5"
          />
        </a>
      </div>
      <LoginButton isDisabled={!isFormValid} onClick={handleLogin} />
      <hr className="border-[#ccc]" />
      <a
        href="#"
        className="h-[66px] shadow-sm shadow-[rgba(0, 0, 0, 0.45)] border-[1px] border-neutral-100 rounded-xs bg-white text-[#0074e9] text-lg font-bold flex items-center justify-center"
      >
        회원가입
      </a>
    </form>
  )
}
