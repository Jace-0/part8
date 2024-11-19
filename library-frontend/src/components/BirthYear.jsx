import { useState } from "react"
import { useMutation } from "@apollo/client"
import { SET_BIRTH_YEAR } from "../queries/queries"
import { AUTHORS } from "../queries/queries"
import Select from 'react-select'
const BirthYear = ({ authors }) => {
    const [name, setName] = useState(null)
    const [born, setBorn] = useState('')

    const [ updateAuthor ] = useMutation(SET_BIRTH_YEAR, {
        refetchQueries: [{query: AUTHORS }]})

    const submit = (e) => {
      e.preventDefault()
      updateAuthor({
        variables : {
            name: name.value,
            setBornTo : parseInt(born, 10)
        }
      })
      setName('')
      setBorn('')
    }
     // Map authors to the format expected by react-select
    const authorOptions = authors.map(author => ({
        value: author.name,
        label: author.name
    }));

    return(
        <div>
        <h2>Set birthyear</h2>
        <form onSubmit={submit}>
        <div>
            <Select
              value={name}
              onChange={setName}
              options={authorOptions}
              />
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
    )
}

export default BirthYear