import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

export function setEnvironment(app) {
    if (process.env.NODE_ENV !== 'production') {
        setDevEnv(app);
    }
    else {
        setProdEnv(app);
    }
}

function setDevEnv(app) {
    process.env.NEO4J_URL = 'bolt://localhost:7687'; 
    process.env.NEO4J_USERNAME = 'neo4j'; 
    process.env.NEO4J_PASSWORD = 'neo4j';
    process.env.IPFS_PATH = '~/.ipfs';
    process.env.USER_SESSION = 'USER_SESSION';
    process.env.PRIVATE_KEY = '2uMu1RfZYsEntPEHbByGfHvNMaAxeSb8BprL6taroPsLtv8FM5FgxTBEVQQJUzjMyGLGZxMTUqxGQVLiFwxML2kC'
    app.use(morgan('dev'));
    app.use(cors());
    app.use(bodyParser.json());
    console.log("Setting development environment");
}

function setProdEnv(app) {
    process.env.NEO4J_URL = 'bolt://localhost:7687'; 
    process.env.NEO4J_USERNAME = 'neo4j'; 
    process.env.NEO4J_PASSWORD = 'neo4j';
    process.env.IPFS_PATH = '~/.ipfs';
    process.env.USER_SESSION = 'USER_SESSION';
    process.env.PRIVATE_KEY = '2uMu1RfZYsEntPEHbByGfHvNMaAxeSb8BprL6taroPsLtv8FM5FgxTBEVQQJUzjMyGLGZxMTUqxGQVLiFwxML2kC'
    app.use(bodyParser.json());
    app.use(morgan('dev'));
    app.use(cors());
    app.use(express.static(__dirname + '/../dist'))
    console.log("Setting production environment");
}