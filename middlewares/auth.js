
const pool = require("../config/config.js")
const {verifyToken} = require("../lib/jwt.js")

// Mengecek usernya sudah login atau belum
// Kalau misalnya belum, berarti Unauthenticated // dilarang akses
const authentication = (req, res, next) => {

    if(req.headers.authorization) {

        const accessToken = req.headers.authorization.split(" ")[1];

        if(accessToken) {
            // Verify token
            // Decode token
            const decoded = verifyToken(accessToken)
            // find user
            const sql = `
                SELECT
                    *
                FROM
                    users
                WHERE
                    id = $1
            `

            pool.query(sql, [decoded.id], (err, result) => {
                if(err) {
                    console.log(err);
                    res.status(500).json({message: "Internal Server Error"})
                } else {

                    const foundUser = result.rows[0]

                    if(!foundUser) {
                        res.status(400).json({message: "Unauthenticated"})
                    } else {

                        // BIKIN CUSTOM PROPERTY
                        // DI BAGIAN REQUEST = REQ

                        req.loggedUser = {
                            id: foundUser.id,
                            email: foundUser.email,
                            role: foundUser.role
                        }

                        // Lanjut ke middleware selanjutnya
                        next()
                    }
                }
            })
        } else {
            res.status(400).json({message: "Unauthenticated"})
        }
       
    } else {
        res.status(400).json({message: "Unauthenticated"})
    }
}

// Pengecekan setelah login
// Mengecek role dari user atau user_id
const authorization = (req, res, next) => {

    // cuma pengecekan role
    const {role} = req.loggedUser;

    if(role === "admin") {
        next();
    } else {
        res.status(401).json({message: "Unauthorized"})
    }
}

module.exports = {
    authentication,
    authorization
}