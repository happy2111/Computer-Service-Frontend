import React from "react";

const SortOrderSelect = ({ sortOrder, setSortOrder }) => (
  <select
    value={sortOrder}
    onChange={e => setSortOrder(e.target.value)}
    className="px-2.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm font-medium bg-white text-gray-700 whitespace-nowrap"
    title="Saralash tartibi"
  >
    <option value="desc">↓ Yangilar</option>
    <option value="asc">↑ Eskilar</option>
  </select>
);

export default SortOrderSelect;
