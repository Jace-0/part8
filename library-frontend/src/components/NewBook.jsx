import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK, BOOKS } from '../queries/queries'

const NewBook = ({ setError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])


  const [createBook ] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      const message = error.graphQLErrors.map(e => e.message).join('\n')
      setError(message)
    },
    // update: (cache, response) => {
    //   cache.updateQuery({ query :BOOKS }, ({
    //     allBooks }) => {
    //       return{
    //         allBooks:
    //         allBooks.concat(response.data.addBook)
    //       }

    //     })
    //     // ,
    //     // cache.updateQuery(
    //     //   { 
    //     //     query: QUERY_BOOK_GENRE,
    //     //     variables: { genre: newBook.genres[0] } // Adjust based on how genres are stored
    //     //   })
    // }
  })


  const submit = async (event) => {
    event.preventDefault()
    createBook({
      variables: {
        title,
        author,
        published: parseInt(published, 10), // Ensure the base is specified for parseInt
        genres
      }})

    console.log('add book...')

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook