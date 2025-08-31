import { useEffect, useState } from 'react'

export default function SearchForm({ onSearch, searchQuery }) {
  const [inputValue, setInputValue] = useState(searchQuery)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])

  const handleSubmit = () => {
    onSearch(inputValue)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div role="group" className="relative flex flex-row">
      <input
        className="grow bg- border-1 border-indigo-300 p-1 peer focus:outline-indigo-500 border-r-0"
        type="search"
        name="query"
        id="query"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <label
        htmlFor="query"
        className={`absolute left-1 top-1 transition-transform pointer-events-none ${
          inputValue || isFocused
            ? 'text-indigo-500 -translate-y-7 scale-75 origin-left'
            : 'text-neutral-500'
        }`}
      >
        도서 검색
      </label>
      <button
        type="submit"
        className="bg-indigo-500 border-indigo-500 border-1 text-white font-semibold px-3 py-1"
        onClick={handleSubmit}
      >
        검색
      </button>
    </div>
  )
}
