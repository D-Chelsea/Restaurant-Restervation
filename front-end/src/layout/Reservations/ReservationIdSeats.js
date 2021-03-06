import React, { useEffect, useState } from 'react'
import { listTables, updateTable } from '../../utils/api'
import { useHistory, useParams } from 'react-router'
import ErrorAlert from '../ErrorAlert'

function ReservationIdSeats() {
    const [tables, setTables] = useState([])
    const [selectTables, setSelectTables] = useState('')
    const [error, setError] = useState(null)
    const { reservationId } = useParams()


    const history = useHistory()


    useEffect(() => {
        const abortController = new AbortController();
        async function loadTables() {
            try {
                const response = await listTables(abortController.signal)
                setTables(response)
            } catch (error) {
                setError(error)
            }
        }
        loadTables()
        return () => abortController.abort()
    }, [])

    function changeHandler({ target }) {
        setSelectTables({ [target.name]: target.value })
    }

    function handleSubmit(event) {
        event.preventDefault()
        const abortController = new AbortController()
        updateTable(reservationId, Number(selectTables.table_id), abortController.signal)
            .then(() => history.push('/dashboard'))
            .catch(setError)

        return () => abortController.abort()
    }
    return (
        <div className="container">
            <h1>Seat Reservation</h1>

            <form onSubmit={handleSubmit}>
                <div>
                <h3>Table name - Table capacity</h3>
                {tables && (
                    <div className="card mb-4">
                        <select className='rounded m-4' name='table_id' required onChange={changeHandler}>
                            <option value=''>Choose a Table</option>
                            {tables.map(table => (
                                <option value={table.table_id} key={table.table_id}>
                                    {table.table_name} - {table.capacity}
                                </option>
                            ))}
                        </select>
                        <ErrorAlert error={error} />
                    </div>
                )}
                <button className="btn btn-outline-light mb-4 mr-3" style={{backgroundColor: "#f2469c"}} type='submit'>Submit</button>
                <button className="btn btn-outline-light mb-4 mr-3" style={{backgroundColor: "#f2469c"}} onClick={history.goBack}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default ReservationIdSeats