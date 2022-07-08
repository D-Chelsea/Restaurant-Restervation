import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import ErrorAlert from '../ErrorAlert'
import { listReservations, listTables, deleteTable } from '../../utils/api'


function ViewTables({ table, index }) {
    const [reservations, setReservations] = useState([])
    const [error, setError] = useState(null)
    const history = useHistory()

    useEffect(() => {
        const abortController = new AbortController()

        function loadReservations() {
            listReservations().then(setReservations).catch(setError)
        }
        loadReservations()
        return () => abortController.abort()
    }, [])

    useEffect(() => {
        const abortController = new AbortController()

        function loadTables() {
            listTables(abortController.signal).catch(setError)
        }
        loadTables()
        return () => abortController.abort()
    }, [])

    async function handleFinish(tableId) {
        const abortController = new AbortController()

        try {
            if (window.confirm('Is this table ready to seat new guests? This cannot be undone.')) {
                await deleteTable(tableId)
                history.go()
            }
        } catch (error) {
            setError(error)
        }
        return () => abortController.abort()
    }
    console.log(table)
    console.log(reservations)
    const foundRes = reservations.find(res => Number(table.reservation_id) === Number(res.reservation_id))
    return (
        <div>
            <div key={index}>
                <div>
                    <h2>Table Name: {table.table_name}</h2><hr />
                    <p>Capacity: {table.capacity}</p>
                    <p data-table-id-status={`${table.table_id}`}>Status:{table.reservation_id}</p>
                    {foundRes && (
                        <p>{foundRes.first_name} {foundRes.last_name}</p>
                    )}
                    {table.reservation_id && (
                        <button 
                        type='submit'
                        data-table-id-finish={`${table.table_id}`} 
                        onClick={() => handleFinish(table.table_id)}>
                            Finish
                        </button>
                    )
                    }
                    <ErrorAlert error={error} />
                </div>
            </div>
        </div>
    )
}

export default ViewTables