export default function LoginButton({ isDisabled, onClick }) {
  return (
    <button
      type="submit"
      disabled={isDisabled}
      onClick={onClick}
      className={`shadow-sm shadow-[rgba(0, 0, 0, 0.45)] rounded-xs h-[66px] text-lg font-bold ${isDisabled ? 'bg-[#97aabd] text-[#d4e0ed] cursor-not-allowed' : 'bg-[#0074e9] text-[#fff] cursor-pointer'}`}
    >
      로그인
    </button>
  )
}
