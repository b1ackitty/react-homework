import { LearnSection } from '@/components'

export default function App() {
  return (
    <LearnSection
      title="React 과제"
      showTitle
      className="m-8 flex flex-col gap-2"
    >
      <ul>
        <li>
          <a
            href="https://github.com/b1ackitty/react-js-vite"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>1주차 과제</strong> - 리액트 프로젝트 템플릿 만들기
          </a>
        </li>
        <li>
          <a
            href="./src/components/week2-homework/index.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>2주차 과제</strong> - 쿠팡 로그인 UI 개선
          </a>
        </li>
      </ul>
    </LearnSection>
  )
}
