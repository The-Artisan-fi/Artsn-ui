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
        <div className="mb-8">
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
      {availableFilters.colors.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-base font-medium">Color</h3>
          <div className="space-y-3">
            {availableFilters.colors.map((color: string) => (
              <label key={color} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.color.includes(color)}
                  onChange={() => {
                    const newColors = filters.color.includes(color)
                      ? filters.color.filter((c: string) => c !== color)
                      : [...filters.color, color]
                    onFilterChange({ color: newColors })
                  }}
                  className="form-checkbox h-4 w-4 border-gray-300 text-black"
                />
                <span className="ml-3 text-sm">{color}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Movement Filter - Only show for watches */}
      {filters.objectType !== 'diamond' &&
        availableFilters.movements.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-4 text-base font-medium">Movement</h3>
            <div className="space-y-3">
              {availableFilters.movements.map((movement: string) => (
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
      <div className="mb-8">
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
