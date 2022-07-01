var expect    = require("chai").expect;
var booksController = require("../controllers/books/books");
const supertest = require('supertest');
const cls = require('continuation-local-storage')
const app = require("../index");

describe("Books Controller", function() {

    var session = null

    before(function () {
        process.env.NEO4J_URL = 'bolt://localhost:7687'; 
        process.env.NEO4J_USERNAME = 'axone-admin'; 
        process.env.NEO4J_PASSWORD = '1234';
        process.env.IPFS_PATH = '~/.ipfs';
        process.env.USER_SESSION = 'USER_SESSION';

        // if (cls.getNamespace(process.env.USER_SESSION)){
        //     cls.destroyNamespace(process.env.USER_SESSION)
        // }
        // session = cls.createNamespace(process.env.USER_SESSION)
    });

    it("Creates The Book, stores it IPFS and keeps a record on neo4j", function() {
        // //const result = booksController.createBook({title: "book 1", summary: "summary of book 1", authorId: "12"});
        
        // // before get/set on the namespace, we call .run to start the context
        // session.run( () => {

        //     const pending = await booksController.createBook({title: "book 1", summary: "summary of book 1", authorId: "12"});
            
        //     pending.then(result => {assert.equal(true, result)});
        // });

        //session.run( () => {
            supertest(app)
                .post("/api/books/create")
                .send({title: "book 1", summary: "summary of book 1", authorId: "12"})
                .expect(200)
                .end(function(err, res){
                    if (err) {
                        console.log(err)
                    }
                    console.log("body: ",res.body)
                });
        //});
    });
});