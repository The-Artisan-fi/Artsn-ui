import React from 'react'
import {
  FilterState,
  AvailableFilters,
  SidebarFilterProps,
  ObjectType,
} from '../Marketplace'

const SidebarFilter: React.FC<SidebarFilterProps> = ({
  filters,
  onFilterChange,
  availableFilters,
}) => {
  // Convert object type strings to display format
  const getDisplayName = (type: ObjectType): string => {
    switch (type) {
      case 'watch':
        return 'Watches'
      case 'diamond':
        return 'Diamonds'
      default:
        return type
    }
  }

  // Get color code for color name
  const getColorCode = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      black: 'bg-black',
      white: 'bg-white border border-gray-300',
      gold: 'bg-yellow-500',
      silver: 'bg-gray-300',
      blue: 'bg-blue-900',
      green: 'bg-green-900',
      red: 'bg-red-900',
      yellow: 'bg-yellow-500',
      rose: 'bg-rose-400',
      gray: 'bg-gray-500',
      brown: 'bg-amber-800',
      // Add more color mappings as needed
    }
    return colorMap[colorName.toLowerCase()] || 'bg-gray-500';
  }

  // Fallback colors in case no colors are available
  const fallbackColors = ['black', 'white', 'gold', 'blue', 'green', 'red'];
  
  // Fallback movements in case no movements are available
  const fallbackMovements = ['Automatic', 'Manual Winding', 'Quartz'];

  const handleObjectTypeChange = (type: ObjectType) => {
    onFilterChange({ objectType: type })
  }

  return (
    <div className="w-full">
      <h2 className="mb-6 text-xl font-semibold">Filters</h2>

      {/* Category Filter */}
      {/* <div className="mb-8">
        <h3 className="text-base font-medium mb-4">Category</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="objectType"
              checked={filters.objectType === 'all'}
              onChange={() => handleObjectTypeChange('all')}
              className="form-radio h-4 w-4 text-black border-gray-300"
            />
            <span className="ml-3 text-sm">All</span>
          </label>
          {availableFilters.objectTypes.map((type: React.Key | null | undefined) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="objectType"
                checked={filters.objectType === type}
                onChange={() => handleObjectTypeChange(type as ObjectType)}
                className="form-radio h-4 w-4 text-black border-gray-300"
              />
              <span className="ml-3 text-sm">{getDisplayName(type as ObjectType)}</span>
            </label>
          ))}
        </div>
      </div> */}

      {/* Brand/Model Filter */}
      {availableFilters.models.length > 0 && (
        <div className="mb-8 bg-gray-100 p-4 rounded-2xl">
          <h3 className="mb-4 text-base font-medium">Brand/Model</h3>
          <div className="space-y-3">
            {availableFilters.models.map((model: string) => (
              <label key={model} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.model.includes(model)}
                  onChange={() => {
                    const newModels = filters.model.includes(model)
                      ? filters.model.filter((m: string) => m !== model)
                      : [...filters.model, model]
                    onFilterChange({ model: newModels })
                  }}
                  className="form-checkbox h-4 w-4 border-gray-300 text-black"
                />
                <span className="ml-3 text-sm">{model}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Color Filter */}
      {(availableFilters.colors.length > 0 || true) && (
        <div className="mb-8 bg-gray-100 p-4 rounded-2xl">
          <h3 className="mb-4 text-base font-medium">Color</h3>
          <div className="flex flex-wrap gap-2">
            {(availableFilters.colors.length > 0 ? availableFilters.colors : fallbackColors).map((color: string) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full ${getColorCode(color)} flex items-center justify-center ${
                  filters.color.includes(color) ? 'ring-2 ring-offset-2 ring-black' : ''
                }`}
                onClick={() => {
                  const newColors = filters.color.includes(color)
                    ? filters.color.filter((c: string) => c !== color)
                    : [...filters.color, color]
                  onFilterChange({ color: newColors })
                }}
                title={color}
              >
                {filters.color.includes(color) && (
                  <span className={`text-xs ${color.toLowerCase() === 'white' ? 'text-black' : 'text-white'}`}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Movement Filter - Only show for watches */}
      {filters.objectType !== 'diamond' &&
        (availableFilters.movements.length > 0 || true) && (
          <div className="mb-8 bg-gray-100 p-4 rounded-2xl">
            <h3 className="mb-4 text-base font-medium">Movement</h3>
            <div className="space-y-3">
              {(availableFilters.movements.length > 0 ? availableFilters.movements : fallbackMovements).map((movement: string) => (
                <label key={movement} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.movement.includes(movement)}
                    onChange={() => {
                      const newMovements = filters.movement.includes(movement)
                        ? filters.movement.filter((m: string) => m !== movement)
                        : [...filters.movement, movement]
                      onFilterChange({ movement: newMovements })
                    }}
                    className="form-checkbox h-4 w-4 border-gray-300 text-black"
                  />
                  <span className="ml-3 text-sm">{movement}</span>
                </label>
              ))}
            </div>
          </div>
        )}

      {/* Price Range */}
      <div className="mb-8 bg-gray-100 p-4 rounded-2xl">
        <h3 className="mb-4 text-base font-medium">Price Range</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm">Min Price</label>
            <input
              type="number"
              value={filters.priceRange.min}
              onChange={(e) =>
                onFilterChange({
                  priceRange: {
                    ...filters.priceRange,
                    min: Number(e.target.value),
                  },
                })
              }
              className="w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Max Price</label>
            <input
              type="number"
              value={
                filters.priceRange.max === Infinity
                  ? ''
                  : filters.priceRange.max
              }
              onChange={(e) =>
                onFilterChange({
                  priceRange: {
                    ...filters.priceRange,
                    max: Number(e.target.value) || Infinity,
                  },
                })
              }
              className="w-full rounded border px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() =>
          onFilterChange({
            objectType: 'all',
            model: [],
            color: [],
            movement: [],
            priceRange: { min: 0, max: Infinity },
          })
        }
        className="w-full rounded-xl bg-black py-2 text-white hover:bg-gray-800"
      >
        Reset Filters
      </button>
    </div>
  )
}

export default SidebarFilter
