const pool = require("../config/config.js")
// MIDDLEWARE
const DEFAULT_LIMIT = 1;
const DEFAULT_PAGE = 1;


// List seluruh tasks
const findAll = (req, res, next) => {

    let {page, limit} = req.query;

    page = +page || DEFAULT_PAGE;
    limit = +limit || DEFAULT_LIMIT;

    // LIMIT => JUMLAH DATA YANG DIMUNCULKAN
    // OFFSET => JUMLAH DATA YANG DI SKIP

    const sql = `
        SELECT
            *
        FROM
            tasks
        LIMIT ${limit} OFFSET ${(page - 1) * limit}
    `

    pool.query(sql, (err, result) => {
        if(err) {
            console.log(err)
            res.status(500).json({message: 'Internal Server Error'})
        } else {
            res.status(200).json(result.rows)
        }
    })

}

// Detail task
const findOne = (req, res, next) => {
    const {id} = req.params;

    const sql = `
        SELECT
            *
        FROM
            tasks
        WHERE 
            id = $1
    `

    pool.query(sql, [id],(err, result) => {
        if(err) {
            console.log(err)
            res.status(500).json({message: 'Internal Server Error'})
        } else {
            res.status(200).json(result.rows[0])
        }
    })
}

// Create task
const create = (req, res, next) => {
    const {title, description} = req.body;

    const sql = `
        INSERT INTO tasks(title, description)
            VALUES
                ($1, $2)
        RETURNING *
    `

    pool.query(sql, [title, description], (err, result) => {
        if(err) {
            console.log(err)
            res.status(500).json({message: 'Internal Server Error'})
        } else {
            res.status(201).json(result.rows[0])
        }   
    })
}

// Update task
const update = (req, res, next) => {
    const {title, description} = req.body;
    const {id} = req.params;

    // Cari dulu tasksnya

    const sql = `
        SELECT
            *
        FROM
            tasks
        WHERE 
            id = $1
    `

    pool.query(sql, [id], (err, result) => {
        if(err) {
            console.log(err)
            res.status(500).json({message: 'Internal Server Error'})
        } else {

            const foundTask = result.rows[0]

            // kalo datanya null
            if(!foundTask) {
                res.status(404).json({message: "Error Not Found"})
            } else {
                
                // update
                const updateSQL = `
                    UPDATE tasks
                        SET title = $1,
                            description = $2
                    WHERE
                        id = $3
                `

                pool.query(updateSQL, [title, description, id], (err, result) => {
                    if(err) {
                        console.log(err)
                        res.status(500).json({message: 'Internal Server Error'})
                    } else {
                        res.status(200).json({message: "Data updated"})
                    }
                })
            }   
        }
    })
}

// Delete task
const destroy = (req, res, next) => {
    const {id} = req.params;

    const sql = `
        SELECT
            *
        FROM
            tasks
        WHERE
            id = $1
    
    `

    pool.query(sql, [id], (err, result) => {
        if(err) {
            console.log(err)
            res.status(500).json({message: 'Internal Server Error'})
        } else {

            const foundTask = result.rows[0]

            if(!foundTask) {
                res.status(404).json({message: "Error Not Found"})
            } else {

                const deleteSQL = `
                    DELETE FROM tasks
                    WHERE id = $1;
                `

                pool.query(deleteSQL, [id], (err, result) => {
                    if(err) {
                        console.log(err)
                        res.status(500).json({message: 'Internal Server Error'})
                    } else {
                        res.status(200).json({message: "Deleted successfully"})
                    }
                })
            }
        }
    })
}

module.exports = {findAll, findOne, create, update, destroy}

