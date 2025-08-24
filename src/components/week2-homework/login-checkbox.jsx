export default function LoginCheckbox({ keepLoggedIn, onChange }) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        name="keep-logged-in"
        id="keep-logged-in"
        checked={keepLoggedIn}
        onChange={onChange}
        className="absolute w-6 h-6 opacity-0 peer"
      />
      <label
        htmlFor="keep-logged-in"
        className="h-6 text-[#555] text-sm cursor-pointer flex justify-center relative peer-focus-visible:outline-2 peer-focus-visible:outline-black peer-focus-visible:outline-solid"
      >
        {keepLoggedIn ? (
          <img
            src="/week2-homework/checkbox-checked.svg"
            alt=""
            className="inline mr-1.5"
          />
        ) : (
          <img
            src="/week2-homework/checkbox.svg"
            alt=""
            className="inline mr-1.5"
          />
        )}
        자동 로그인
      </label>
    </div>
  )
}
