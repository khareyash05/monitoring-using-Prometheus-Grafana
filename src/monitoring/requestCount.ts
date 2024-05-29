import { Request,Response,NextFunction } from 'express';
import client from 'prom-client'

const requestCounter = new client.Counter({
    name:'request',
    help: 'Number of requests',
    labelNames :["method","route","status_code"] // labels on which the metrics need to be divided
})

const activeUserGauge = new client.Gauge({
    name:'active_users',
    help:"Total number of users whose request hasnt been resolved",
    labelNames:["method","route"]
})

export const requestCount = (req:Request,res:Response,next:NextFunction)=>{
    requestCounter.inc({
        method:req.method,
        route:req.path
    });

    activeUserGauge.inc({ // when request started ic=ncremenet counter
        method:req.method,
        route:req.path
    })

    res.on("finish",()=>{ // when request finish decrement active user on the request
        setTimeout(()=>{ // just to check the increment and decrement
            activeUserGauge.dec({
                method:req.method,
                route:req.path
            })
        },10000)
    })

    next();
}