const TabSwitcher = () => {
  return (
    <div className="flex w-full items-center justify-between">
      {/* Tabs */}
      <div className="border-gray flex space-x-4 rounded-2xl p-1">
        <button className="rounded-xl border bg-white px-4 py-2 text-black focus:outline-none">
          Products
        </button>
        <button className="px-4 py-2 text-gray-600 hover:text-black focus:outline-none">
          Collections
        </button>
      </div>

      {/* Sort by */}
      <div className="text-md border-gray rounded-2xl p-3 text-black">
        <span>Sort by</span>
      </div>
    </div>
  )
}

export default TabSwitcher
