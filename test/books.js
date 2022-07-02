import {expect} from "chai";
import {createBook} from "../controllers/books/books.js";
import * as spt from 'supertest';
import * as cls from 'continuation-local-storage'
// import {server} from "../index.js";

describe("Books Controller", function() {

    var session = null
    this.timeout(15000);

    before(function () {
        process.env.NEO4J_URL = 'bolt://localhost:7687'; 
        process.env.NEO4J_USERNAME = 'axone-admin'; 
        process.env.NEO4J_PASSWORD = '1234';
        process.env.IPFS_PATH = '~/.ipfs';
        process.env.USER_SESSION = 'USER_SESSION';

        if (cls.getNamespace(process.env.USER_SESSION)){
            cls.destroyNamespace(process.env.USER_SESSION)
        }
        session = cls.createNamespace(process.env.USER_SESSION)
    });

    it("Creates the book, stores the metadata on IPFS and keeps a record on neo4j", async function() {
        var result =  await createBook({title: "book 1", summary: "summary of book 1", authorId: "12"});
        
        expect(result.cid).to.equal('bafyreibx5bxpuhtxnnx5rdd44k3il43h33kniylhkna7imq65rdbnngys4');
    });

    it("Gets a book from neo4j based on the cid", async function() {
        var result =  await createBook({title: "book 1", summary: "summary of book 1", authorId: "12"});
        
        expect(result.cid).to.equal('bafyreibx5bxpuhtxnnx5rdd44k3il43h33kniylhkna7imq65rdbnngys4');
    });
});