import {Book} from '../../models/book.js'

/**
 * Receives the book details and:
 * 1. Stores the metadata through IPLD and gets the CID
 * 2. Stores the metadata and the CID reference on neo4j DB 
 * @param {*} params 
 * @returns 
 */
export async function createBook(params) {
    var newBook = new Book(params.title, params.summary, params.authorId)
    var savedBook = await newBook.save()
    return savedBook
}

export function home() {}

export function searchForBooks(query) {}

export function getBook(id) {}

export function getChapters(id) {}