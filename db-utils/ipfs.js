import * as cls from 'continuation-local-storage';
//const IPFS = require('ipfs-core')
import * as IPFS from 'ipfs-core'

export async function getIpfsNode() {
    console.log("get ipfs node...\n")
    var session = cls.getNamespace(process.env.USER_SESSION);
    var node = session.get('IPFS_NODE')
    
    if(!node) {
        node = await IPFS.create({
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

        try{
            session.set('IPFS_NODE', node)
        }catch(err){
            console.log('error setting session ipfs node: ', err.message)
        }
    }

    console.log("got ipfs node\n")
    return node;
}
