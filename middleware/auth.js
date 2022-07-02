import express from 'express';
import * as cls from 'continuation-local-storage';

export function setSession(app) {
    app.use((req, res, next) => {

        // TODO: get the session id from the request and check validity
        
        // TODO: if validated, get the session id and create a new session

        var session = cls.createNamespace(process.env.USER_SESSION)

        nameSpace.run(() => {

            session.set('sessionId', '123456');
            
            next()
        })
       
    })
}