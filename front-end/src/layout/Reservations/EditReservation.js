import React, { useState, useEffect } from "react";
import { readReservation, updateReservation } from "../../utils/api"
import { useParams, useHistory } from "react-router";
import ErrorAlert from "../ErrorAlert";


export default function EditReservation() {
    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
      }
    const { reservationId } = useParams()
    const history = useHistory()
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({ ...initialFormState })
    
    useEffect(() => {
        const abortController = new AbortController()
        async function fetchData() {
            try {
                if (reservationId) {
                    const response = await readReservation(reservationId, abortController.signal)
                    setFormData(response)
                } else {
                    setFormData({ ...initialFormState })
                }
            } catch (error) {
                setError(error)
            }
        }
        fetchData()
        return () => abortController.abort();
        // eslint-disable-next-line
    }, [reservationId]);

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        })
    }

    const handleNumber = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: Number(target.value)
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const abortController = new AbortController()
        try {
            const response = await updateReservation(formData, abortController.signal)
            history.push(`/dashboard?date=${formData.reservation_date}`)
            return response
        } catch (error) {
            setError(error)
        }
        return () => abortController.abort()
    }
    console.log(formData.reservation_time)

    return (
        <div>
            <h2>Edit Reservation</h2>
            <ErrorAlert error={error} />
        <div className="card">
        <form onSubmit={handleSubmit} className="form-card mx-2">
        <fieldset>
            <legend className="form-item">Reservation Form</legend>
            <div className="form-item">
            <label htmlFor="first_name">First Name:</label>
            <input
                className="form-control"
                pattern="[a-zA-Z]+"
                id="first_name"
                onChange={handleChange}
                type="text"
                name="first_name"
                required
                placeholder="first name"
                value={formData.first_name}
            />
            </div>
            <div className="form-item">
            <label htmlFor="last_name">Last Name:</label>
            <input
                className="form-control"
                id="last_name"
                onChange={handleChange}
                type="text"
                name="last_name"
                required
                placeholder="last name"
                value={formData.last_name}
            />
            </div>
            <div className="form-item">
            <label htmlFor="mobile_number">Mobile Number:</label>
            <input
                className="form-control"
                id="mobile_number"
                onChange={handleChange}
                type="text"
                name="mobile_number"
                required
                placeholder="mobile number"
                value={formData.mobile_number}
            />
            </div>
            <div className="form-item">
            <label htmlFor="reservation_date">Reservation Date:</label>
            <input
                className="form-control"
                id="reservation_date"
                onChange={handleChange}
                type="date"
                name="reservation_date"
                required
                placeholder="reservation_date"
                value={formData.reservation_date}
            />
            </div>
            <div className="form-item">
            <label htmlFor="reservation_time">Reservation Time:</label>
            <input
                className="form-control"
                id="reservation_time"
                onChange={handleChange}
                type="time"
                name="reservation_time"
                required
                placeholder="reservation_time"
                value={formData.reservation_time}
            />
            </div>
            <div className="form-item">
            <label htmlFor="people">Party Size:</label>
            <input
                className="form-control"
                id="people"
                onChange={handleNumber}
                type="number"
                name="people"
                required
                placeholder="party size"
                value={formData.people}
                min={1}
            />
            </div>
        </fieldset>
        <div className="form-item mt-2 mb-2">
            <button 
            className="btn btn-outline-light mb-4 mr-3" 
            style={{backgroundColor: "#f2469c"}}
            type="submit"
            >
            Submit
            </button>
            <button
            className="btn btn-outline-light mb-4 mr-3" 
            style={{backgroundColor: "#4a0025"}}
            type="button"
            onClick={() => history.push(`/dashboard?date=${formData.reservation_date}`)}
            >
            Cancel
            </button>
        </div>
        </form>
  </div>
        </div>
    )
}