import React from "react";
import { Visibility, Edit, Delete } from "@mui/icons-material";

/**
 * ReusableTable Component
 * @param {Array} data - Array of data objects to display (e.g., doctors)
 * @param {Array} columns - Array of column definitions (from gridConstants)
 */
const ReusableTable = ({ data = [], columns = [] }) => {
  const handleView = (item) => console.log("Viewing item:", item);
  const handleEdit = (item) => console.log("Editing item:", item);
  const handleDelete = (item) => console.log("Deleting item:", item);

  if (!data.length) {
    return (
      <div className="text-center py-6 text-gray-500 font-secondary">
        No records found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto font-primary">
      <table className="min-w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
        {/* Table Head */}
        <thead>
          <tr className="bg-primary text-white">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left px-4 py-3 text-sm font-semibold tracking-wide uppercase"
                style={{ width: col.width || "auto" }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id || index}
              className={`transition-colors duration-150 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-accent/10`}
            >
              {columns.map((col) => (
                <td key={`${item.id}-${col.key}`} className="px-4 py-3 text-sm">
                  {col.isAction ? (
                    // 💡 Action Buttons
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => handleView(item)}
                        title="View Details"
                        className="text-primary hover:text-primary-dark transition-colors"
                      >
                        <Visibility fontSize="small" />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        title="Edit Record"
                        className="text-secondary hover:text-accent transition-colors"
                      >
                        <Edit fontSize="small" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        title="Delete Record"
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Delete fontSize="small" />
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`${
                        col.key === "status"
                          ? item.status === "Active"
                            ? "text-green-600 font-medium"
                            : "text-pink-600 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {item[col.key]}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;
