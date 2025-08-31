import { useCallback, useEffect, useState } from 'react'
import BOOK_DATA from './book-data.json'

export default function App() {
  const [books] = useState(BOOK_DATA)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredBooks, setFilteredBooks] = useState(BOOK_DATA)

  const filterBooks = useCallback(
    (query) => {
      if (!query.trim()) {
        setFilteredBooks(books)
        return
      }

      const filtered = books.filter((book) => {
        return (
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()) ||
          book.publisher.toLowerCase().includes(query.toLowerCase()) ||
          book.category.toLowerCase().includes(query.toLowerCase())
        )
      })
      setFilteredBooks(filtered)
    },
    [books]
  )

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get('query') || ''
    setSearchQuery(query)
    filterBooks(query)
  }, [filterBooks])

  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const query = urlParams.get('query') || ''
      setSearchQuery(query)
      filterBooks(query)
    }

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [filterBooks])

  const handleSearch = (query) => {
    setSearchQuery(query)
    filterBooks(query)

    const url = new URL(window.location.href)
    if (query.trim()) {
      url.searchParams.set('query', query)
    } else {
      url.searchParams.delete('query')
    }
    window.history.pushState({}, '', url)
  }

  const categories = [...new Set(books.map((book) => book.category))]

  return (
    <section className="text-indigo-950 p-10 flex flex-col gap-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center">도서 목록</h1>
      <SearchForm onSearch={handleSearch} searchQuery={searchQuery} />
      <CategoryTags
        categories={categories}
        searchQuery={searchQuery}
        onTagClick={handleSearch}
      />
      <BookList books={filteredBooks} searchQuery={searchQuery} />
    </section>
  )
}

function SearchForm({ onSearch, searchQuery }) {
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

function CategoryTags({ categories, searchQuery, onTagClick }) {
  return (
    <ul className="flex flex-wrap gap-2 justify-center">
      <li key="all">
        <button
          type="button"
          onClick={() => onTagClick('')}
          className={`px-3 py-1 rounded-full font-medium ${
            !searchQuery || !categories.includes(searchQuery)
              ? 'bg-indigo-500 text-white'
              : 'bg-neutral-200 text-indigo-950 hover:bg-indigo-300'
          }`}
        >
          전체 보기
        </button>
      </li>
      {categories.map((category) => {
        const isActive = searchQuery === category

        return (
          <li key={category}>
            <button
              type="button"
              onClick={() => onTagClick(isActive ? '' : category)}
              className={`px-3 py-1 rounded-full font-medium ${
                isActive
                  ? 'bg-indigo-500 text-white'
                  : 'bg-neutral-200 text-indigo-950 hover:bg-indigo-300'
              }`}
            >
              {category}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function BookList({ books, searchQuery }) {
  return (
    <div role="group">
      <p className="text-lg font-semibold mb-4">
        {searchQuery
          ? `"${searchQuery}" 검색 결과: ${books.length}권`
          : `전체 도서: ${books.length}권`}
      </p>
      {books.length === 0 ? (
        <p className="text-center py-8 text-neutral-500">
          검색 결과가 없습니다.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-4">
          {books.map((book) => (
            <BookCard
              book={book}
              key={`${book.category}-${crypto.randomUUID()}`}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

function BookCard({ book }) {
  return (
    <li className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-neutral-200">
      <h2 className="text-lg font-semibold text-neutral-800 mb-2">
        {book.title}
      </h2>
      <dl className="flex flex-col gap-1 text-neutral-600 text-sm">
        <div role="group" className="flex gap-1">
          <dt>저자: </dt>
          <dd>{book.author}</dd>
        </div>
        <div role="group" className="flex gap-1">
          <dt>출판사: </dt>
          <dd>{book.publisher}</dd>
        </div>
        <div role="group">
          <dt className="sr-only">가격</dt>
          <dd className="text-lg font-bold text-indigo-600">
            {book.price.toLocaleString()} 원
          </dd>
        </div>
        <div role="group">
          <dt className="sr-only">종류</dt>
          <dd className="px-3 py-1 rounded-full text-sx font-medium bg-indigo-100 text-indigo-800 max-w-fit mt-1">
            {book.category}
          </dd>
        </div>
      </dl>
    </li>
  )
}
