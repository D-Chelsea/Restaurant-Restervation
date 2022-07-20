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

  useEffect(() =>{
    const abortController = new AbortController()
    async function loadTables(){
      try{
        listTables(abortController.signal)
        .then(setTables)
      }catch(error){
        setError(error)
      }
    }
    loadTables()
  }, [])


  useEffect(() =>{
    const abortController = new AbortController()
    async function loadDashboard(){
      try{
        listReservations({date}, abortController.signal)
        .then(setReservations)
      }catch(error){
        setError(error)
      }
    }
    loadDashboard()
  }, [date])

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
      <div className="text-center py-4">
        <h1>Dashboard</h1>
        <div>
          <label className="mx-2" htmlFor="reservation_date">
            <h4>Choose date:</h4>
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
            <button 
            className="btn btn-outline-light mb-4 mr-3"
             style={{backgroundColor: "#83e6cb"}} 
             onClick={() => handlePreviousDate(date)}>
               Previous</button>
            <button 
            className="btn btn-outline-light mb-4 mr-3"
            style={{backgroundColor: "#83e6cb"}} 
            onClick={() => setDate(today())}>
              Today</button>
            <button 
            className="btn btn-outline-light mb-4 mr-3" 
            style={{backgroundColor: "#83e6cb"}} 
            onClick={() => handleNextDate(date)}>
              Next</button>
          </div>
        </div>
      </div>

      <ErrorAlert error={error} />
      <ViewReservation reservations={reservations} />
      <h2 className="text-center">Tables</h2>
      <ListTable tables={tables}/>
    </main>
  )
}

export default Dashboard;
