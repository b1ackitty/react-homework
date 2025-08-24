export default function Logo() {
  return (
    <h1>
      <span className="sr-only">쿠팡 로그인</span>
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="홈페이지로 이동"
      >
        <img
          src="/week2-homework/coupang-logo.svg"
          alt=""
          width={246}
          height={56}
        />
      </a>
    </h1>
  )
}
