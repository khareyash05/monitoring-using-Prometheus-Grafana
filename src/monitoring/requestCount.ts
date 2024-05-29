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

const httpRequestDuration = new client.Histogram({
    name:'http_request_duration',
    help:"Duration",
    labelNames:["method","route",'code'],
    buckets:[0.1,5,15,50,100,300,500,1000,3000,5000]
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

    res.on("finish",()=>{ // when request finish dec`rement active user on the request
        setTimeout(()=>{ // just to check the increment and decrement
            activeUserGauge.dec({
                method:req.method,
                route:req.path
            })
        },10000)
    }) 

    const startTime = Date.now()

    res.on('finish', () =>{
        const endTime = Date.now()
        httpRequestDuration.observe({
            method:req.method,
            route:req.path,
            code:req.statusCode
        },endTime-startTime)
    })

    next();
}