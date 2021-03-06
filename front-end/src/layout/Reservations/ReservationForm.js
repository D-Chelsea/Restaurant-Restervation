import React, {useState, useEffect } from "react"
import { useHistory , useParams, useLocation } from "react-router-dom"
import { createReservation } from "../../utils/api"
import { readReservation, updateReservation } from "../../utils/api"
import ErrorAlert from "../ErrorAlert"

function ReservationForm(){
    const history = useHistory()
    const { reservationId } = useParams()
    const {pathname} = useLocation();

    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
      }


    const [formData, setFormData] = useState(initialFormState);
    const [postResError, setPostResError] = useState(false);
    const [isEdit, setIsEdit ] = useState(false)

    const handleChange = (event) => {
        event.preventDefault();
        setFormData((newReservation) => ({
          ...newReservation,[event.target.name]: event.target.value}))
      }
      const handleNumberChange = (event) => {
        event.preventDefault();
        setFormData((newReservation) => ({
          ...newReservation,[event.target.name]: Number(event.target.value)}))
      }
    
      const handleSubmit = async (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        const newReservation = {
          ...formData
        }
        try {
          await createReservation(newReservation, abortController.signal)
          setFormData({...initialFormState});
          history.push(`/dashboard?date=${newReservation.reservation_date}`)
        } catch (error) {
          setPostResError(error)
        }
  
        return () => abortController.abort()
      }
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
                setPostResError(error)
            }
        }
        function addOrEdit(){
          if (pathname.includes("new")){
            setIsEdit(false)
          }else{
            setIsEdit(true)
            fetchData()
          }
        }
        addOrEdit()
        return () => abortController.abort()
        // eslint-disable-next-line
    }, [reservationId]);

    const handleEditChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        })
    }

    const handleEditNumber = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: Number(target.value)
        })
    }

    const handleEditSubmit = async (event) => {
        event.preventDefault()
        const abortController = new AbortController()
        try {
            const response = await updateReservation(formData, abortController.signal)
            setIsEdit(true)
            history.push(`/dashboard?date=${formData.reservation_date}`)
            return response
        } catch (error) {
            setPostResError(error)
        }
        return () => abortController.abort()
    }




    return(
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
            onChange={isEdit? handleEditChange : handleChange}
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
            onChange={isEdit? handleEditChange : handleChange}
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
            onChange={isEdit? handleEditChange : handleChange}
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
            onChange={isEdit? handleEditChange : handleChange}
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
            onChange={isEdit? handleEditChange : handleChange}
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
            onChange={isEdit? handleEditNumber : handleNumberChange}
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
        <button className="btn btn-outline-light mb-4 mr-3" 
            style={{backgroundColor: "#f2469c"}} type="submit"
            onClick={isEdit ? handleEditSubmit : handleSubmit }>
          Submit
        </button>
        <button
          className="btn btn-outline-light mb-4 mr-3" style={{backgroundColor: "#4a0025"}}
          type="button"
          onClick={() => history.push(`/dashboard?date=${formData.reservation_date}`)}
        >
          Cancel
        </button>
        <ErrorAlert error={postResError} />
      </div>
    </form>
  </div>
);
}


export default ReservationForm
