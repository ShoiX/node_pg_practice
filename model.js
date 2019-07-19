
// migration object
export const schema = {
    create: [
        `CREATE TABLE cards(
            id BIGSERIAL PRIMARY KEY,
            name TEXT
        )`
    ],
    drop : [
        `DROP TABLE IF EXISTS cards`
    ]
}


// database interface for our application
export async function insert(pg, data){
    return pg.rows(
        `INSERT INTO cards(name) VALUES ($1) RETURNING id`, data
    )
}

export async function retrieve(pg, id){
    return pg.rows(`SELECT name from cards where id = $1`, id)

}

export async function retrieveAll(pg){
    return pg.rows(`SELECT id, name from cards`)
}

export async function update(pg, data, id){
    return pg.rows(`UPDATE cards SET name = $1 WHERE id = $2`, data, id)
}
