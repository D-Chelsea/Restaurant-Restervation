import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import ViewReservation from "../layout/Reservations/ViewReservation"
import ListTable from "../layout/Tables/ListTable"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard() {
  const query = useQuery()
  const history = useHistory()
  const [reservations, setReservations] = useState([])
  const [tables, setTables] = useState([])
  const [error, setError] = useState(null);
  const [date, setDate] = useState(query.get("date") || today())

  useEffect(loadDashboard, [date])
  useEffect(loadTables, [])

  function loadTables() {
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then(setTables)
      .catch(setError);
    return () => abortController.abort();
  }


  function loadDashboard() {
    const abortController = new AbortController();
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setError);
    return () => abortController.abort();
  }

  function handleDateChange({ target }) {
    setDate(target.value)
  }

  function handlePreviousDate() {
    setDate(previous(date))
    history.push(`dashboard?date=${previous(date)}`)
  }
  function handleNextDate() {
    setDate(next(date))
    history.push(`dashboard?date=${next(date)}`)
  }

  return (
    <main>
      <div>
        <h1 >Dashboard</h1>
        <div>
          <label className="mx-2" htmlFor="reservation_date">
            Choose date:
          </label>
          <input
            type="date"
            pattern="\d{4}-\d{2}-\d{2}"
            name="reservation_date"
            onChange={handleDateChange}
            value={date}
          />
        </div>

        <div>
          <div>
            <button onClick={() => handlePreviousDate(date)}>Previous</button>
            <button onClick={() => setDate(today())}>Today</button>
            <button onClick={() => handleNextDate(date)}>Next</button>
          </div>
        </div>
      </div>

      <ErrorAlert error={error} />
      <ViewReservation reservations={reservations} />
      <ListTable tables={tables}/>
    </main>
  )
}

export default Dashboard;
