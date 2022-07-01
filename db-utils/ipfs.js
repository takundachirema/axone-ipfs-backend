const cls = require('continuation-local-storage');
//const IPFS = require('ipfs-core')
//import * as IPFS from 'ipfs-core'

exports.getNode = async function () {
    console.log("** get ipfs node 1 **")

    const { create } = await import('ipfs-core')
    
    console.log("** get ipfs node 2 **")

    var session = cls.getNamespace(process.env.USER_SESSION);
    var node = session.get('IPFS_NODE')
    
    if(!node) {
        console.log("** awaiting node")
        node = await create({
            repo: process.env.IPFS_PATH,
            offline: true,
            config: {
                Addresses: {
                    Swarm: [
                    '/ip4/0.0.0.0/tcp/0'
                    ],
                    API: '/ip4/127.0.0.1/tcp/0',
                    Gateway: '/ip4/127.0.0.1/tcp/0'
                }
            },
            ipld: undefined
        })
        session.set('IPFS_NODE', node)
    }
    return node;
};