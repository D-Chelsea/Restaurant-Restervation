import React, { useState } from 'react'
import ErrorAlert from '../ErrorAlert'
import ViewReservation from '../Reservations/ViewReservation'
import { listReservations } from '../../utils/api'

export default function Search() {
    const [reservations, setReservations] = useState([])
    const [number, setNumber] = useState('')
    const [error, setError] = useState(null)
    const [found, setfound] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()
        const abortController = new AbortController()
        setfound(false)
        try {
            const response = await listReservations({ mobile_number: number }, abortController.signal)
            setReservations(response)
            setfound(true)
            setNumber('')
        } catch (error) {
            setError(error)
        }
        return () => abortController.abort()
    }

    function handleChange({ target }) {
        setNumber(target.value)
    }

    return (
        <div className="card-body text-center">
            <ErrorAlert error={error} />
            <h2>Search By Phone Number</h2>
            <form onSubmit={handleSubmit}>
                <input
                    className='form-control form-group'
                    type="text"
                    name="mobile_number"
                    value={number}
                    onChange={handleChange}
                    placeholder="Enter a customer's phone number"
                    required
                />
                <button className="btn btn-outline-light mb-4 mr-3 mb-2 " style={{backgroundColor: "#f2469c"}} type="submit">
                    Find
                </button>
            </form>
            {reservations.length > 0 ? (
            <div>
            <h3>Matching Reservation:</h3>
            <ViewReservation reservations={reservations} />
            </div>
            ) : found && reservations.length === 0 ? (
                <h4>No reservations found</h4>
            ) : ('')}
        </div>
    )

}