import { useQuery } from "@apollo/client"
import { BOOKS, QUERY_BOOK_GENRE} from "../queries/queries"
import { useState, useEffect } from "react"

const Books = () => {
  // const [books, setBooks] = useState([])
  const [selectedGenre, setSelectedGenre] = useState(null);
  const {loading,  data } = useQuery(BOOKS)
  const {loading: loadingBooks,  data: booksData} = useQuery(BOOKS)

  const {loading: genreLoading, data: genreData } = useQuery(QUERY_BOOK_GENRE, {
    variables: {genre: selectedGenre},
    skip : !selectedGenre
  })

  // Determine which data to use
  const load = loading || genreLoading || loadingBooks;
  const books = selectedGenre ? genreData?.allBooks : data?.allBooks;


  if (load || !books) {
    return <div>loading...</div>;
  }

  // useEffect(() => {
  //   if (data?.allBooks) {
  //     setBooks(data.allBooks);
  //   }
  // }, [data]);

  //   // 5. Handle genre filter data
  //   useEffect(() => {
  //     if (genreData?.allBooks) {
  //       setBooks(genreData.allBooks);
  //     }
  //   }, [genreData]);
    
    // if (loading || genreLoading || loadingBooks) return <div>loading...</div>;
  // const books = data.allBooks

  const genreFilter = (genre) => {
    setSelectedGenre(genre)
  }

 const Button = ({ genre }) => {
  return(
    <button onClick={() => genreFilter(genre)}>{genre}</button>
  )
 }



  // Use a Set to collect unique genres
  // const uniqueGenres = new Set();

  // // Iterate over each book
  // books.forEach(book => {
  //   book.genres.forEach(genre => {
  //     uniqueGenres.add(genre);
  //   });
  // });

  // // Convert the Set back to an array
  // const uniqueGenresArray = Array.from(uniqueGenres);

  // Get unique genres
  const uniqueGenres = [...new Set(booksData.allBooks.flatMap(book => book.genres))];
  console.log(uniqueGenres)


  return (
    <div>
      <h2>Books</h2>

      <table>
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
      </table>
      {uniqueGenres.map(genre => (
          <Button key={genre} genre={genre} />
         ))}
      
    </div>
  )
}

export default Books