import { nodeLabels } from '../helpers/nodeTypes.js'

import * as _ from 'lodash';
import {getIpfsNode} from '../db-utils/ipfs.js';
import {getNeo4jSession} from '../db-utils/neo4j.js';

export class Book {
  constructor(title, summary, authorId) {
      this.title = title
      this.summary = summary
      this.authorId = authorId
  }

  /**
   * This method saves the book as metadata on IPFS and saves it as a node on neo4j
   */
  async save() {
    console.log("saving book...\n")
    var cid = await this.saveIPFS();

    var node = await this.saveNeo4j(cid)

    console.log("** got neo4j:", node.properties)
    return node.properties;
  }

  /**
   * The method gets the IPFS node and saves the book metadata on it.
   * @returns the book metadata CID
   */
  async saveIPFS() {
    console.log("saving on ipfs...\n")
    var ipfs = await getIpfsNode()

    var bookMetadata = {title:this.title, summary: this.summary, authorId: this.authorId}

    console.log("save book metadata. returns cid...\n")
    const cid = await ipfs.dag.put(bookMetadata, { format: 'dag-cbor', hashAlg: 'sha2-256' })

    console.log('book metadata cid:', cid)
    return cid
  }

  /**
   * saves the book metadata on neo4j db
   * @param {*} cid for the unique identifier of the book metadata
   * @returns the saved metadata record
   */
  async saveNeo4j(cid) {
    console.log("saving on neo4j...\n")
    var session = getNeo4jSession()
    
    console.log("writing transaction on neo4j...\n")
    try {
      var node = await session.writeTransaction(txc =>
        txc.run(`CREATE (n: ${nodeLabels.book} 
        {
          cid: '${cid}', 
          title: '${this.title}', 
          summary: '${this.summary}', 
          authorId: '${this.authorId}'
        }) 
        RETURN n`)
      )

      console.log("returned neo4j node")
      return node.records[0].get(0)
    }
    catch(err){
      console.log("error saveing neo4j node: ", err.message)
    }
  }
}
