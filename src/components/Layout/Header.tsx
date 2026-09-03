export function Header() {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  })

  return (
    <header className="bg-blue-600 text-white p-4 shadow">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">회의실 예약</h1>
        <p className="text-blue-100 text-sm mt-1">{today}</p>
      </div>
    </header>
  )
}
