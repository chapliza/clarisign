require('dotenv').config()

var faunadb = require('faunadb'),
  q = faunadb.query

var getId = urlPath => {
  return urlPath.match(/([^\/]*)\/*$/)[0]
}

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
})

export function handler(event, context, callback) {
  const data = JSON.parse(event.body)
  const id = getId(event.path)
  console.log(`Function 'cards-update' invoked. update id: ${id}`)
  return client
    .query(q.Update(q.Ref(`classes/cards/${id}`), { data }))
    .then(response => {
      console.log('success', response)
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response),
      })
    })
    .catch(error => {
      console.log('error', error)
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify('There was an error, check the logs.'),
      })
    })
}
