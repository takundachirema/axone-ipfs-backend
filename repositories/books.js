const _ = require('lodash');
const dbUtils = require('../neo4j/dbUtils');
const Book = require('../models/neo4j/book');
const Person = require('../models/person');
const Genre = require('../models/genre');

const _singleBookWithDetails = function (record) {
  if (record.length) {
    const result = {};
    _.extend(result, new Book(record.get('book'), record.get('my_rating')));

    result.directors = _.map(record.get('directors'), record => {
      return new Person(record);
    });
    result.genres = _.map(record.get('genres'), record => {
      return new Genre(record);
    });
    result.producers = _.map(record.get('producers'), record => {
      return new Person(record);
    });
    result.writers = _.map(record.get('writers'), record => {
      return new Person(record);
    });
    result.actors = _.map(record.get('actors'), record => {
      return record;
    });
    result.related = _.map(record.get('related'), record => {
      return new Book(record);
    });
    return result;
  } else {
    return null;
  }
};

/**
 *  Query Functions
 */

const _getByWriter = function (params, options, callback) {
  const cypher_params = {
    id: params.id
  };

  const query = [
    'MATCH (:Person {tmdbId: $id})-[:WRITER_OF]->(book:Book)',
    'RETURN DISTINCT book'
  ].join('\n');

  callback(null, query, cypher_params);
};

function manyBooks(neo4jResult) {
  return neo4jResult.records.map(r => new Book(r.get('book')))
}

// get all books
const getAll = function (session) {
  return session.readTransaction(txc => (
      txc.run('MATCH (book:Book) RETURN book')
    ))
    .then(r => manyBooks(r));
};

// get a single book by id
const getById = function (session, bookId, userId) {
  const query = [
    'MATCH (book:Book {tmdbId: $bookId})',
    'OPTIONAL MATCH (book)<-[my_rated:RATED]-(me:User {id: $userId})',
    'OPTIONAL MATCH (book)<-[r:ACTED_IN]-(a:Person)',
    'OPTIONAL MATCH (related:Book)<--(a:Person) WHERE related <> book',
    'OPTIONAL MATCH (book)-[:IN_GENRE]->(genre:Genre)',
    'OPTIONAL MATCH (book)<-[:DIRECTED]-(d:Person)',
    'OPTIONAL MATCH (book)<-[:PRODUCED]-(p:Person)',
    'OPTIONAL MATCH (book)<-[:WRITER_OF]-(w:Person)',
    'WITH DISTINCT book,',
    'my_rated,',
    'genre, d, p, w, a, r, related, count(related) AS countRelated',
    'ORDER BY countRelated DESC',
    'RETURN DISTINCT book,',
    'my_rated.rating AS my_rating,',
    'collect(DISTINCT d) AS directors,',
    'collect(DISTINCT p) AS producers,',
    'collect(DISTINCT w) AS writers,',
    'collect(DISTINCT{ name:a.name, id:a.tmdbId, poster_image:a.poster, role:r.role}) AS actors,',
    'collect(DISTINCT related) AS related,',
    'collect(DISTINCT genre) AS genres',
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {
        bookId: bookId,
        userId: userId
      })
    )
    .then(result => {
      if (!_.isEmpty(result.records)) {
        return _singleBookWithDetails(result.records[0]);
      }
      else {
        throw {message: 'book not found', status: 404}
      }
    });
};

// Get by date range
const getByDateRange = function (session, start, end) {
  const query = [
    'MATCH (book:Book)',
    'WHERE book.released > $start AND book.released < $end',
    'RETURN book'
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {
        start: parseInt(start || 0),
        end: parseInt(end || 0)
      })
    )
    .then(result => manyBooks(result))
};

// Get by date range
const getByActor = function (session, id) {
  const query = [
    'MATCH (actor:Person {tmdbId: $id})-[:ACTED_IN]->(book:Book)',
    'RETURN DISTINCT book'
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {
        id: id
      })
    ).then(result => manyBooks(result))
};

// get a book by genre
const getByGenre = function(session, genreId) {
  const query = [
    'MATCH (book:Book)-[:IN_GENRE]->(genre)',
    'WHERE toLower(genre.name) = toLower($genreId) OR id(genre) = toInteger($genreId)', // while transitioning to the sandbox data             
    'RETURN book'
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {
        genreId: genreId
      })
    ).then(result => manyBooks(result));
};

// Get many books directed by a person
const getByDirector = function(session, personId) {
  const query = [
    'MATCH (:Person {tmdbId: $personId})-[:DIRECTED]->(book:Book)',
    'RETURN DISTINCT book'
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {
        personId: personId
      })
    ).then(result => manyBooks(result));
};

// Get many books written by a person
const getByWriter = function(session, personId) {
  const query = [
    'MATCH (:Person {tmdbId: $personId})-[:WRITER_OF]->(book:Book)',
    'RETURN DISTINCT book'
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {
        personId: personId
      })
    ).then(result => manyBooks(result));
};

const rate = function (session, bookId, userId, rating) {
  return session.writeTransaction(txc =>
    txc.run(
      'MATCH (u:User {id: $userId}),(m:Book {tmdbId: $bookId}) \
      MERGE (u)-[r:RATED]->(m) \
      SET r.rating = $rating \
      RETURN m',
      {
        userId: userId,
        bookId: bookId,
        rating: parseInt(rating)
      }
    )
  );
};

const deleteRating = function (session, bookId, userId) {
  return session.writeTransaction(txc =>
    txc.run(
      'MATCH (u:User {id: $userId})-[r:RATED]->(m:Book {tmdbId: $bookId}) DELETE r',
      {userId: userId, bookId: bookId}
    )
  );
};

const getRatedByUser = function (session, userId) {
  return session.readTransaction(txc =>
    txc.run(
      'MATCH (:User {id: $userId})-[rated:RATED]->(book:Book) \
       RETURN DISTINCT book, rated.rating as my_rating',
      {userId: userId}
    )
  ).then(result => {
    return result.records.map(r => new Book(r.get('book'), r.get('my_rating')))
  });
};

const getRecommended = function (session, userId) {
  return session.readTransaction(txc =>
    txc.run(
      'MATCH (me:User {id: $userId})-[my:RATED]->(m:Book) \
      MATCH (other:User)-[their:RATED]->(m) \
      WHERE me <> other \
      AND abs(my.rating - their.rating) < 2 \
      WITH other,m \
      MATCH (other)-[otherRating:RATED]->(book:Book) \
      WHERE book <> m \
      WITH avg(otherRating.rating) AS avgRating, book \
      RETURN book \
      ORDER BY avgRating desc \
      LIMIT 25',
      {userId: userId}
    )
  ).then(result => manyBooks(result));
};

// export exposed functions
module.exports = {
  getAll: getAll,
  getById: getById,
  getByDateRange: getByDateRange,
  getByActor: getByActor,
  getByGenre: getByGenre,
  getBooksbyDirector: getByDirector,
  getBooksByWriter: getByWriter,
  rate: rate,
  deleteRating: deleteRating,
  getRatedByUser: getRatedByUser,
  getRecommended: getRecommended
};
