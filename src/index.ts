import express from 'express';
import { requestCount } from './monitoring/requestCount';
import client from 'prom-client' // lets export metrics

const app = express();

app.use(requestCount)
app.get('/user',(req,res)=>{
    res.json({
        name: 'user',
    })  
})

app.post('/user',(req,res)=>{
    res.json({
        name: 'user',
    })
})

app.get("/metrics",async(req,res)=>{
    const metrics = await client.register.metrics()
    res.set('Content-Type',client.register.contentType)
    res.end(metrics)
})

app.listen(3000)