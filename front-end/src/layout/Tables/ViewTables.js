import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import ErrorAlert from '../ErrorAlert'
import { listReservations, listTables, deleteTable } from '../../utils/api'


function ViewTables({ table, index }) {
    const history = useHistory()


    const [reservations, setReservations] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        const abortController = new AbortController();
        async function loadTables() {
            try {
                await listTables(abortController.signal)
            } catch (error) {
                setError(error)
            }
        }
        loadTables()
        return () => abortController.abort()
    }, [])

    // useEffect(() => {
    //     const abortController = new AbortController()
    //     async function loadReservations() {
    //         listReservations().then(setReservations).catch(setError)
    //     }
    //     loadReservations()
    //     return () => abortController.abort()
    // }, [])
    useEffect(() => {
        const abortController = new AbortController();
        async function loadReservations() {
            try {
                const response= await listReservations(abortController.signal)
                setReservations(response)
            } catch (error) {
                setError(error)
            }
        }
        loadReservations()
        return () => abortController.abort()
    }, [])

    // useEffect(() => {
    //     const abortController = new AbortController()
    //     function loadTables() {
    //         listTables(abortController.signal).catch(setError)
    //     }
    //     loadTables()
    //     return () => abortController.abort()
    // }, [])

    async function handleFinish(tableId) {
        const abortController = new AbortController()

        try {
            if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
                await deleteTable(tableId)
                history.go()
            }
        } catch (error) {
            setError(error)
        }
        return () => abortController.abort()
    }

    const foundRes = reservations.find(res => Number(table.reservation_id) === Number(res.reservation_id))
    return (
        <div className="container">
            <div key={index}>
                <div className="card mb-2">
                    <div className="card-body text-center mx-2">
                    <h4>Table Name: {table.table_name}</h4><hr />
                    <p>Capacity: {table.capacity}</p>
                    <p data-table-id-status={`${table.table_id}`}>Status: {table.reservation_id ? "Occupied" : "Free"}</p>
                    {foundRes && (
                        <p>{foundRes.first_name} {foundRes.last_name}</p>
                    )}
                    {table.reservation_id && (
                        <button 
                        className="btn btn-outline-light mb-4 mr-3" 
                        style={{backgroundColor: "#f2469c"}}
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
        </div>
    )
}

export default ViewTables