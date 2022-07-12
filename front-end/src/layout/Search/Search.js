import React, { useState } from 'react'
import ErrorAlert from '../ErrorAlert'
import ViewReservations from '../Reservations/ViewReservation'
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
        <div>
            <ErrorAlert error={error} />
            <h2>Search By Phone Number</h2>
            <form onSubmit={handleSubmit}>
                <input
                    className='form-control'
                    type="text"
                    name="mobile_number"
                    value={number}
                    onChange={handleChange}
                    placeholder="Enter a customer's phone number"
                    required
                />
                <button className='btn btn-primary' type="submit">
                    Find
                </button>
            </form>
            {reservations.length > 0 ? (
                <ViewReservations reservations={reservations} />
            ) : found && reservations.length === 0 ? (
                <p>No reservations match</p>
            ) : ('')}
        </div>
    )

}