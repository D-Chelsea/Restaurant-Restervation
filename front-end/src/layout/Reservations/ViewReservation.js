import React , { useState }from 'react'
import { useHistory } from "react-router"
import ErrorAlert from '../ErrorAlert'
import { updateStatus } from '../../utils/api'

function ViewReservation({reservations}){
    const [showError, setShowError] = useState(null);
    const history = useHistory()
    /** handle cancel a reservation*/
    async function handleCancel(reservationId) {
        if (window.confirm('Do you want to cancel this reservation? This cannot be undone.')) {
            try {
                await updateStatus(reservationId)
                history.go()
            } catch (error) {
                setShowError(error)
            }
        }
    }

return(
    <div className="container">
    {reservations.map((reservation) => (
    <div className="card mb-2"  key={reservation.reservation_id}>
      {(reservation.status !== "finished" && reservation.status !== "cancelled") &&(
      <div className="card-body text-center mx-2">
        <p>Name: {reservation.first_name} {reservation.last_name}</p>
        <p>Mobile: {reservation.mobile_number}</p>
        <p>Party Size: {reservation.people}</p>
        <p>
        {reservation.reservation_date} at {reservation.reservation_time}
        </p>
        <p data-reservation-id-status={`${reservation.reservation_id}`}>
          Status: {reservation.status}
        </p>
        
    <div>
      <ErrorAlert error={showError}/>
      <button className="btn btn-outline-light mb-4 mr-3" style={{backgroundColor: "#f2469c"}}>
        <a href={`/reservations/${reservation.reservation_id}/edit`}>Edit</a>
      </button>
      <button className="btn btn-outline-light mb-4 mr-3" style={{backgroundColor: "#f2469c"}}>
        <a href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a>
      </button>
      <button className="btn btn-outline-light mb-4 mr-3" style={{backgroundColor: "#4a0025"}} onClick={handleCancel}>Cancel</button>
    </div>
    </div>
      )}
    </div>
    ))}
  </div>
)
}

export default ViewReservation