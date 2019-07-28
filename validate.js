
import * as swagger from 'swagger2'

export function validation(spec) {
    const compiled = swagger.compileDocument(spec)
    
    return async (ctx, next) => {
        
        if (spec.basePath !== undefined && !ctx.path.startsWith(spec.basePath)) {
            // not a path that we care about
            await next()
            return
        }

        const compiledPath = compiled(ctx.path)
        if (compiledPath === undefined) {
            // if there is no single matching path, return 404 (not found)
            ctx.status = 404
            return
        }

        // check the request matches the swagger schema
        const validationErrors = swagger.validateRequest(compiledPath, ctx.method, ctx.request.query,
            ctx.request.body)

        if (validationErrors === undefined) {
            // operation not defined, return 405 (method not allowed)
            if (ctx.method !== 'OPTIONS') {
                ctx.status = 405
            }
            return
        }
        if (validationErrors.length > 0) {
            ctx.status = 400
            ctx.body = {
                code: 'SWAGGER_REQUEST_VALIDATION_FAILED',
                errors: validationErrors
            }
            return
        }

        // wait for the operation to execute
        await next()

    }
}