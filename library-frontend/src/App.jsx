import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommedation from "./components/Recommedation";
import { BOOKS, BOOK_ADDED } from "./queries/queries";

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import { useApolloClient, useQuery, useSubscription } from "@apollo/client";


export const updateCache = (cache, query, addedBook ) => {
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: allBooks.concat(addedBook)
    }
  })
}

const App = () => {
  const [errorMessage, setErrorMessage ] = useState(null)
  const [ token, setToken ] = useState(null)
  // const [showLogin, setShowLogin] = useState(false)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      updateCache(client.cache, { query: BOOKS }, addedBook)
      window.alert(`New book ${addedBook.title} by ${addedBook.author.name} added`)
    }
  })


  useEffect(() => {
    if (!token) {
      const token = localStorage.getItem('library-user-token')
      setToken(token)
    }
  }, [token])
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 1000);
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  
 
  return (
    <Router>
    <div>
{/* on homepage , when user clicks it hide the homepga and render the login, then logged in , it navigat to th home  */}
    <div>
      <Link to='/'><button>authors</button></Link>
      <Link to='/books'><button>books</button></Link>
      {token ? <Link to='/add'><button>add book</button></Link> : ''}
      {!token && <Link to='/login'> <button>login</button> </Link>}
      {token && <Link to='/recommendation'><button>recommendation</button></Link>}
      {token && <button onClick={logout}>logout</button>}
    </div>

      <Routes>
        <Route path='/' element={<Authors/>}></Route>
        <Route path='/books' element={<Books/>}></Route>
        <Route path='/add' element={<NewBook setError={notify}/>}></Route>
        <Route path='/login' element={<LoginForm setError={notify} setToken={setToken}/>}></Route>
        <Route path='/recommendation' element={<Recommedation/>}></Route>
      </Routes>
    </div>
    </Router>
  );
};

export default App;
