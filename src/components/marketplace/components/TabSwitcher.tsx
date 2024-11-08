const TabSwitcher = () => {
    return (
      <div className="flex items-center justify-between w-full">
        {/* Tabs */}
        <div className="flex space-x-4 border-gray rounded-2xl p-1">
          <button className="px-4 py-2 text-black bg-white border rounded-xl focus:outline-none">Products</button>
          <button className="px-4 py-2 text-gray-600 hover:text-black focus:outline-none">Collections</button>
        </div>
  
        {/* Sort by */}
        <div className="text-md text-black border-gray rounded-2xl p-3">
          <span>Sort by</span>
        </div>
      </div>
    );
  };
  
  export default TabSwitcher;
  