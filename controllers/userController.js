// Middleware
const pool = require("../config/config.js")
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const {generateToken} = require("../lib/jwt.js")

const register = (req, res, next) => {
    
    // Email, Password, Role
    // destructuring
    const {email, password, role} = req.body;
    // Cek email terdaftar
    const sql = `
        SELECT
            *
        FROM
            users
        WHERE email = $1
    `

    pool.query(sql, [email], (err, result) => {
        if(err) {
            console.log(err)
            res.status(500).json({message: 'Internal Server Error'})
        } else {

            const foundUser = result.rows[0]
            if(!foundUser) {
                // Register
                
                const insertSql = `
                    INSERT INTO users(email, password, role)
                        VALUES
                            ($1, $2, $3)
                    RETURNING *
                `

                pool.query(insertSql, [email, bcrypt.hashSync(password, salt), role], (err, result) => {
                    if(err) {
                        console.log(err)
                        res.status(500).json({message: 'Internal Server Error'})
                    } else {
                        res.status(201).json(result.rows[0])
                    }
                })
            } else {
                // Error
                res.status(400).json({message: "Email already exists"})
            }
        }
    })
}

const login = (req, res, next) => {

    const {email, password} = req.body;

    // Pengecekan email
    const sql = `
        SELECT
            *
        FROM
            users
        WHERE
            email = $1
    `

    pool.query(sql, [email], (err, result) => {
        if(err) {
            console.log(err)
            res.status(500).json({message: 'Internal Server Error'})
        } else {

            const foundUser = result.rows[0]

            if(!foundUser) {
                res.status(400).json({message: "Wrong email or password"})
            } else {

                // cek password
                if(bcrypt.compareSync(password, foundUser.password)) {
                    // berhasil login   
                    // accessToken pake jsonwebtoken

                    const accessToken = generateToken({
                        id: foundUser.id,
                        email: foundUser.email,
                        role: foundUser.role
                    })

                    res.status(200).json({
                        message: "Login successfull",
                        accessToken,
                        role: foundUser.role
                    })
                } else {
                    res.status(400).json({message: "Wrong email or password"})
                }
            }
        }
    })

}

module.exports = {register, login}