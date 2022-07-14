import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { createTable } from "../../utils/api"
import ErrorAlert from "../ErrorAlert";

function TableForm(){
    const history = useHistory()

    const initialFormState = {
        table_name: "",
        capacity: 0,
      }

      

      const [formData, setFormData] = useState(initialFormState);
      const [postResError, setPostResError] = useState(false);

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
        event.preventDefault();
        const abortController = new AbortController();
        try {
            await createTable(formData, abortController.signa)
            setFormData({ ...initialFormState })
            history.push('/dashboard')
        } catch (error) {
            setPostResError(error)
        }
        return () => abortController.abort()
    }
    return(
        <div className="container">
            {/* <legend className="form-item">Reservation Form</legend> */}
            <ErrorAlert error={postResError} />
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="table_name">Table Name</label>
                    <input
                        type='text'
                        className='form-control'
                        id='table_name'
                        name='table_name'
                        placeholder='Table Name'
                        value={formData.table_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="capacity">Capacity</label>
                    <input
                        type='number'
                        className='form-control mb-4'
                        id='capacity'
                        name='capacity'
                        min={1}
                        placeholder="1"
                        value={formData.capacity}
                        onChange={handleNumber}
                        required
                    />
                </div>
                <button type='submit' className="btn btn-outline-light mb-4 mr-3" 
            style={{backgroundColor: "#f2469c"}}>
                    Submit
                </button>
                <button onClick={history.goBack} className="btn btn-outline-light mb-4 mr-3" 
            style={{backgroundColor: "#4a0025"}}>
                    Cancel
                </button>
            </form>
        </div>
    )
}

export default TableForm