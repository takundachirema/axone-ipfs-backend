import express from 'express';
const cls = require('continuation-local-storage')

export function setSession(app) {
    app.use((req, res, next) => {

        // TODO: get the session id from the request and check validity
        
        // TODO: if validated, get the session id and create a new session

        var session = cls.createNamespace(process.env.USER_SESSION)

        //session.set('sessionId', '123456');

        next()
    })
}