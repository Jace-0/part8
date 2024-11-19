import { useQuery } from '@apollo/client'
import BirthYear from './BirthYear'
import { AUTHORS } from '../queries/queries'


const Authors = () => {
  // if (!props.show) {
  //   return null
  // }



  const {loading, data} = useQuery(AUTHORS)

  if (loading){
    return <div>loading...</div>
  }



  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <BirthYear authors={data.allAuthors}/>
    </div>
  )
}

export default Authors
