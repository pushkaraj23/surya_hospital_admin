import React from 'react';
import { Box } from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';

/**
 * ReusableTable Component
 * @param {Array} data - Array of data objects to display (e.g., doctors)
 * @param {Array} columns - Array of column definitions (from gridConstants)
 */

const ReusableTable = ({ data, columns }) => {
    if (!data || data.length === 0) {
        return <Box sx={{ p: 2, textAlign: 'center', color: 'gray' }}>No records found.</Box>;
    }

    const handleView = (item) => console.log('Viewing item:', item);
    const handleEdit = (item) => console.log('Editing item:', item);
    const handleDelete = (item) => console.log('Deleting item:', item);

    return (
        <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#4A148C', color: 'white' }}>
                        {columns.map(col => (
                            <th key={col.key} style={{ padding: '12px', textAlign: 'left', width: col.width || 'auto' }}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr 
                            key={item.id || index} // Use unique ID or index as fallback
                            style={{ 
                                borderBottom: '1px solid #eee', 
                                backgroundColor: index % 2 === 0 ? 'white' : '#fafafa',
                                cursor: 'pointer',
                                transition: 'background-color 0.1s',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0f7fa'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#fafafa'}
                        >
                            {columns.map(col => (
                                // <td 
                                //     key={`${item.id}-${col.key}`} 
                                //     style={{ 
                                //         padding: '12px', 
                                //         // Specific styling for the 'Status' key, demonstrating column-based logic
                                //         color: col.key === 'status' ? (item.status === 'Active' ? '#009688' : '#e91e63') : 'inherit' 
                                //     }}
                                // >
                                //     {item[col.key]}
                                <td 
                                    key={`${item.id}-${col.key}`} 
                                    style={{ padding: '12px' }}
                                >
                                    {col.isAction ? (
                                        // 💡 Render Action Buttons
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start' }}>
                                            <button 
                                                onClick={() => handleView(item)} 
                                                style={{ border: 'none', background: 'none', color: '#2196f3', cursor: 'pointer', padding: '4px' }}
                                                title="View Details"
                                            >
                                                <Visibility sx={{ fontSize: 20 }} />
                                            </button>
                                            <button 
                                                onClick={() => handleEdit(item)} 
                                                style={{ border: 'none', color: '#ff9800', cursor: 'pointer', padding: '4px' }}
                                                title="Edit Record"
                                            >
                                                <Edit sx={{ fontSize: 20 }} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item)} 
                                                style={{ border: 'none', color: red, cursor: 'pointer', padding: '4px' }}
                                                title="Delete Record"
                                            >
                                                <Delete sx={{ fontSize: 20 }} />
                                            </button>
                                        </Box>
                                    ) : (
                                        // Render regular data field
                                        <span style={{ color: col.key === 'status' ? (item.status === 'Active' ? '#009688' : '#e91e63') : 'inherit' }}>
                                            {item[col.key]}
                                        </span>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Box>
    );
};

export default ReusableTable;