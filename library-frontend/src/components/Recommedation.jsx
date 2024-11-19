import { useQuery } from "@apollo/client"
import { USER, QUERY_BOOK_GENRE } from "../queries/queries"

const Recommedation = () => {
 
  const {loading: loadingUser , data: userData } = useQuery(USER)

   // Get favorite genre safely using optional chaining
  const favoriteGenre = userData?.me?.favoriteGenre

  const {loading, data } = useQuery(QUERY_BOOK_GENRE, {
    pollInterval: 2000,
    variables: {genre: favoriteGenre},
    skip : !favoriteGenre
  },
)



  if (loading || loadingUser) {
    return <div>Loading recommendations...</div>
  }

  const books = data?.allBooks || []
  console.log('User', userData )
  console.log('Data', data )
    return(
        <div>
          <h2>recommedation</h2>
          books in your favourite genre <strong>{favoriteGenre}</strong>

          {books.length > 0 ? <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>  : (
        <p>No books found in your favorite genre.</p>
      )}
        </div>
    )
}

export default Recommedation