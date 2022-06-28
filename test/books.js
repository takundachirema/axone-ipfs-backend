var expect    = require("chai").expect;
var booksController = require("../controllers/books/books");

describe("Books Controller", function() {
    it("Creates The Book, stores it IPFS and keeps a record on neo4j", function() {
        const result = booksController.createBook({title: "book 1", summary: "summary of book 1", authorId: "12"});
        expect(result).to.equal('OK');
    });
});