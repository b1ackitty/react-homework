import { useEffect, useState } from 'react'
import CategoryTags from './book-category-tags'
import BOOK_DATA from './book-data.json'
import BookList from './book-list'
import SearchForm from './book-search-form'

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredBooks, setFilteredBooks] = useState(BOOK_DATA)

  const filterBooks = (query) => {
    if (!query.trim()) {
      setFilteredBooks(BOOK_DATA)
      return
    }

    const filtered = BOOK_DATA.filter((book) => {
      return (
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.publisher.toLowerCase().includes(query.toLowerCase()) ||
        book.category.toLowerCase().includes(query.toLowerCase())
      )
    })
    setFilteredBooks(filtered)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get('query') || ''
    setSearchQuery(query)
    filterBooks(query)
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const query = urlParams.get('query') || ''
      setSearchQuery(query)
      filterBooks(query)
    }

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

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

  const categories = [...new Set(BOOK_DATA.map((book) => book.category))]

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
