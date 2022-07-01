// import { create } from 'ipfs-http-client'
import { nodeLabels } from '../helpers/nodeTypes'

const _ = require('lodash');
const ipfsUtils = require('../db-utils/ipfs');
const neo4jUtils = require('../db-utils/neo4j');

// connect to the default API address http://localhost:5001
// const client = create()

module.exports = class Book {
  constructor(title, summary, authorId) {
      this.title = title
      this.summary = summary
      this.authorId = authorId
  }

  /**
   * This method saves the book as metadata on IPFS and saves it as a node on neo4j
   */
  async save() {
    console.log("** in save **")
    var cid = await this.saveIPFS();
    console.log("** after ipfs ** ")
    console.log(cid)
    var node = await this.saveNeo4j(cid)
      //.then(result => function(){console.log("** got something **")})
      //.catch(next);
    console.log("** got something **")
    return node;
  }

  async saveIPFS() {
    var ipfs = await ipfsUtils.getNode()

    var bookMetadata = {title:this.title, summary: this.summary, authorId: this.authorId}
    const cid = await ipfs.dag.put(bookMetadata, { format: 'dag-cbor', hashAlg: 'sha2-256' })

    console.log(`*** saved ipfs: ${cid}`)
    return cid
  }

  saveNeo4j(cid){
    var session = neo4jUtils.getSession()
    return session.readTransaction(txc =>
      txc.run(`CREATE (n: ${nodeLabels.book} 
        {
          cid: ${cid}, 
          title: ${this.title}, 
          summary: ${this.summary}, 
          authorId: ${this.authorId}
        }) 
        RETURN n`)
        .then(result => function(){return result})
    );
  }
}
