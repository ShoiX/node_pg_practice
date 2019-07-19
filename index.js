import Koa from 'koa'
import Router from 'koa-router'
import jsonBody from 'koa-json-body'
import {postgresMiddleware, postgres } from './postgres'
import {schema, insert, retrieve, retrieveAll, update } from './model'

// swagger and swaggerui modules
import * as swagger from 'swagger2'
import {ui, validate } from 'swagger2-koa'

// load API spec from swagger.yml
const spec = swagger.loadDocumentSync('./swagger.yml')

// validate document
if (!swagger.validateDocument(spec)) {
    throw new Error('Invalid Swagger file')
}

const app = new Koa()
    .use(jsonBody())
    .use(postgresMiddleware(schema))

// use /v1 prefix for our routes
const router = new Router({
    'prefix': '/v1'
})

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
    .get('/swagger.json', (ctx) => {ctx.body = spec})

app.use(router.routes())
app.use(router.allowedMethods())
app.use(ui(spec))
app.use(validate(spec))

app.listen(8080)
console.log('Server started at port 8080')