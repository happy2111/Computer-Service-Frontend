import React from "react";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";

function getSortIcon(order) {
  if (order === "desc") return <ArrowDownWideNarrow className="inline w-4 h-4 mr-1 text-blue-500" />;
  if (order === "asc") return <ArrowUpNarrowWide className="inline w-4 h-4 mr-1 text-blue-500" />;
  return null;
}

const SortOrderSelect = ({ sortOrder, setSortOrder }) => (
  <div className="flex items-center">
    <select
      value={sortOrder}
      onChange={e => setSortOrder(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto"
      style={{ paddingLeft: 0 }}
    >
      <option value="desc">Yangi birinchi</option>
      <option value="asc">Eski birinchi</option>
    </select>
  </div>
);

export default SortOrderSelect;

