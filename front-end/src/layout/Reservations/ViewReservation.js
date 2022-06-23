import React , { useState }from 'react'
import { useHistory } from "react-router"
import ErrorAlert from '../ErrorAlert'
import { updateStatus} from '../../utils/api'

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
    <div>
    {reservations.map((reservation) => (
    <div key={reservation.reservation_id}>
        <p>
        {reservation.status}
        </p>
        <p>Name: {reservation.first_name} {reservation.last_name}</p>
        <p>Mobile: {reservation.mobile_number}</p>
        <p>Party Size: {reservation.people}</p>
        <p>
        {reservation.reservation_date} at {reservation.reservation_time}
        </p>
    <div>
      <ErrorAlert error={showError}/>
      <button>
        <a href={`/reservations/${reservation.reservation_id}/edit`}>Edit</a>
      </button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
    </div>
    ))}
  </div>
)
}

export default ViewReservation