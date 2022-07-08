import React from 'react'
import ViewTable from '../Tables/ViewTables'

export default function TableList({ tables }) {
    return (
        <div>
            {tables && (
                <div className='container'>
                    <div>
                        {tables.map((table) => (
                            <div key={table.table_id}>
                                <ViewTable table={table} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}