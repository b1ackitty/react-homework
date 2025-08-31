export default function CategoryTags({ categories, searchQuery, onTagClick }) {
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
