const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

// a helper to check if a field is requested
const isFieldRequested = (info, fieldName) => {
  
  return info.fieldNodes[0].selectionSet.selections
    .some(selection => selection.name.value === fieldName);
};

const resolvers = {
    Query: {
      bookCount: () => Book.collection.countDocuments(),
      authorCount: () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
        let query =  Book.find({}).populate('author')

        // If genre specified, filter by genre
        if (args.genre) {
          query = query.find({genres: args.genre})
          // 
          
        }
        
        let books = await query
        // 
        
          // If author specified, filter by author
        if (args.author) {
          books = books.filter(book => 
            book.author.name === args.author
          )
        }
      
        return books
        },
        me: (root, args, context) => {
          return context.currentUser
          
          
        },
        allAuthors: async (_, __, ___, info) => {
          const needsBookCount = isFieldRequested(info, 'bookCount')
          
          if (needsBookCount) {
            const authors = await Author.aggregate([
              {
                $lookup: {
                  from: 'books',
                  localField: '_id',
                  foreignField: 'author',
                  as: 'books'
                }
              },
                {
                  $project: {
                    name: 1,
                    born: 1,
                    bookCount: {$size : '$books'}
                  }
                }
            ])
            return authors
          }
          
          return await Author.find({})
        }
    },
    Author: {
      bookCount: async (root) => {
        if (root.bookCount !== undefined) {
          return root.bookCount
        }

        const books = await Book.find({author: root._id})
        return books.length
          // return books.filter(book => book.author == root.name).length
      }
    },
    Mutation: {
      addBook: async (root, args, context) => {
        const currentUser = context.currentUser
        if(!currentUser){
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })
        }
  
        
        if (args.title.length < 5){
          throw new GraphQLError('Book name should be greater than 5')
        }
        if (args.author.length < 4){
          throw new GraphQLError('Author name should be greater than 4')
        }
        
        let author = await Author.findOne({name: args.author})
  
        
        
          
        if (!author) {
          author = new Author({ name: args.author });
          await author.save();
          
        }
  
        // Create the new book
        const book = new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: author._id
        });
  
  
        
        
        try {
          await book.save()
  
        }catch(error) {
          throw new GraphQLError(error.message, {
            invalidArgs: args
          })
        }
        await book.populate('author')
  
        
        pubsub.publish('BOOK_ADDED', { bookAdded: book })
        return book
      },
      editAuthor : async (root, args, context) => {
        const currentUser = context.currentUser
  
        if(!currentUser){
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })
        }
        try {
          // Find the author by name
          const author = await Author.findOne({ name: args.name });
          
          if (!author) {
            throw new GraphQLError('Author not found');
          }
  
          // Update the author's birth year
          author.born = args.setBornTo;
          await author.save();
  
          return author;
        } catch (error) {
          throw new GraphQLError(error.message);
        }
      },
      createUser : async (root, args) => {
        const user = new User({...args})

        return user.save()
          .catch(error => {
            throw new GraphQLError('Creating the user faiied', {
              extensions: {
                code : 'BAD_USER_INPUT',
                invalidArgs: args.username,
                error
              }
            })
          })
      },
      login : async (root, args) => {  
        const user = await User.findOne({username: args.username})  
        
  
        if (!user || args.password !== 'secret'){
          throw new GraphQLError ('wrong credentials ', {
            extensions: {code: 'BAD_USER_INPUT'}
          })
        } 
  
        const userForToken = {
          username: user.username,
          id: user._id
        }
  
        
        return {value: jwt.sign(userForToken, process.env.JWT_SECRET)}
      }
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        }
    }
  }

  module.exports = resolvers
  