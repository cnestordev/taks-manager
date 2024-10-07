import './FormContainer.css'

const FormContainer = ({title, description, priority, setTitle, setDescription, setPriority, addTask}) => {
    return (
        <div className="form-container">
        <h1 className='form-title'>Add Task</h1>
        <form onSubmit={(e) => addTask(e)}>
          <div className="input-field">
            <label htmlFor="title">Title:</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" id="title" />
          </div>
          <div className="input-field">
            <label htmlFor="description">Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} id="description" />
          </div>
          <div className="input-field">
            <label htmlFor="priority">Priority:</label>
            <select  value={priority} onChange={(e) => setPriority(e.target.value)} id="priority">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className='submit-container'>
            <button className='btn-submit' type="submit">Add Task</button>
          </div>
        </form>
      </div>
    )
}

export default FormContainer