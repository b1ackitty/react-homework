import BookCard from './book-card'

export default function BookList({ books, searchQuery }) {
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
