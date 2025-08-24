import { useState } from 'react'

export default function LoginInput({ type, value, onChange, error }) {
  const [isHidden, setHidden] = useState(true)

  const toggleHideButton = () => {
    setHidden(!isHidden)
  }

  const inputType = type === 'password' && !isHidden ? 'text' : type

  return (
    <div>
      <label htmlFor={type} className="sr-only">
        {type === 'email' ? '아이디(이메일)' : '비밀번호'}
      </label>
      <div
        className={`flex flex-row border-solid border-[1px] border-[#${error ? 'e52528' : 'ccc'}]`}
      >
        {type === 'email' ? (
          <img
            src={`/week2-homework/email.svg`}
            alt=""
            width={45}
            height={50}
          />
        ) : (
          <img
            src={`/week2-homework/password.svg`}
            alt=""
            width={45}
            height={50}
          />
        )}
        <input
          type={inputType}
          name={type}
          id={type}
          value={value}
          onChange={onChange}
          placeholder={type === 'email' ? '아이디(이메일)' : '비밀번호'}
          className="grow-[1] px-3.5 text-[#111] font-medium"
        />
        {type === 'password' ? (
          <button
            type="button"
            onClick={toggleHideButton}
            className="cursor-pointer"
            aria-label={isHidden ? '비밀번호 표시' : '비밀번호 숨김'}
          >
            {isHidden ? (
              <img
                src={`/week2-homework/hide.svg`}
                alt=""
                title="비밀번호 표시"
              />
            ) : (
              <img
                src={`/week2-homework/show.svg`}
                alt=""
                title="비밀번호 숨김"
              />
            )}
          </button>
        ) : null}
      </div>
      {error ? (
        <span className="px-3 py-2.5 font-medium text-[15px] text-[#e52528]">
          {error}
        </span>
      ) : null}
    </div>
  )
}
