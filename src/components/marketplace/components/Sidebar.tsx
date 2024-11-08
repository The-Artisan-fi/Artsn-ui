// components/SidebarFilter.tsx

const SidebarFilter = () => {
    return (
      <div className="bg-white p-4 rounded-3xl border-gray text-black">
        {/* Model Filter */}
        <div className="bg-gray p-4 rounded-2xl border-gray mb-4">
          <h4 className="font-bold mb-2">Model</h4>
          <ul>
            <li className="mb-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Patek (123)
              </label>
            </li>
            <li className="mb-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Rolex (123)
              </label>
            </li>
            <li className="mb-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Cars (123)
              </label>
            </li>
          </ul>
        </div>
  
        {/* Color Filter */}
        <div className="bg-gray p-4 rounded-2xl border-gray mb-4">
          <h4 className="font-bold mb-2">Color</h4>
          <div className="flex space-x-2">
            <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
            <div className="w-6 h-6 bg-green-900 rounded-full"></div>
            <div className="w-6 h-6 bg-blue-900 rounded-full"></div>
            <div className="w-6 h-6 bg-red-900 rounded-full"></div>
            <div className="w-6 h-6 bg-black rounded-full"></div>
            <div className="w-6 h-6 bg-white rounded-full"></div>
          </div>
        </div>
  
        {/* Movement Filter */}
        <div className="bg-gray p-4 rounded-2xl border-gray">
          <h4 className="font-bold mb-2">Movement</h4>
          <ul>
            <li>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Automatic
              </label>
            </li>
            <li>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Manual Winding
              </label>
            </li>
            <li>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Quartz
              </label>
            </li>
          </ul>
        </div>
      </div>
    );
  };
  
  export default SidebarFilter;
  