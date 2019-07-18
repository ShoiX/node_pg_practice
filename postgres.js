import PgAsync from 'pg-async'
import once from 'once'

async function setup(pg, schema) {
    await pg.transaction(async (tx) => {
        const { drop, create } = schema
        if (drop) {
            for (const q of drop) {
                await tx.query(q)
            }
        }
        if (create) {
            for (const q of create) {
                await tx.query(q)
            }
        }
    })
}

export function postgresMiddleware( schema ){
    const pg = new PgAsync({connectionString: process.env.POSTGRES_URI})
    const setupSchema = once(setup)

    return async (ctx, next) => {
        await setupSchema(pg, schema)
        ctx._postgres = pg
        return await next()
    }
}

export function postgres(ctx) {
    return ctx._postgres
}