import Koa from 'koa'
import Router from 'koa-router'
import jsonBody from 'koa-json-body'
import {postgresMiddleware, postgres } from './postgres'
import {schema, insert, retrieve, retrieveAll, update } from './model' 

const app = new Koa()
    .use(jsonBody())
    .use(postgresMiddleware(schema))
const router = new Router()

router
    .post('/cards', async (ctx) =>{
        const data = ctx.request.body
        const id = await insert(postgres(ctx), data.name)
        ctx.status = 200
        ctx.body = id[0].id
    })
    .get('/cards', async (ctx) => {
        const data = await retrieveAll(postgres(ctx))
        ctx.status = 200
        ctx.body = data
    })
    .get('/cards/:id', async (ctx) => {
        const data = await retrieve(postgres(ctx), ctx.params.id)
        ctx.status = 200
        ctx.body = data[0]
    })
    .put('/cards/:id', async (ctx) => {
        const data = ctx.request.body
        await update(postgres(ctx), data.name, ctx.params.id)
        ctx.status = 204
    })

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(8080)
console.log('Server started at port 8080')