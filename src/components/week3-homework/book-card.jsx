export default function BookCard({ book }) {
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
