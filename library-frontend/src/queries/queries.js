import { gql } from "@apollo/client"

const BOOK_DETAILS = gql`
fragment BookDetails on Books {
  title
  author{
   name
  }
  published
  genres
  
}
`

export const AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
  }
}

`


export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
${BOOK_DETAILS}
`


export const CREATE_BOOK = gql`
mutation AddBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(title: $title, author: $author, published: $published, genres: $genres) {
    title
    published
    id
    genres
    author {
      name
      born
      bookCount
    }
  }
}
`


export const BOOKS = gql`
query {
  allBooks {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`
export const QUERY_BOOK_GENRE = gql`
query Query($genre: String) {
  allBooks(genre: $genre) {
    title
    published
    id
    genres
    author {
      name
      born
      bookCount
    }
  }
}
`


export const SET_BIRTH_YEAR = gql`
mutation EditAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name
    born
    bookCount
  }
}
  
`


export const LOGIN = gql`
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`


export const USER = gql`
query {
  me {
    username
    id
    favoriteGenre
  }
}`