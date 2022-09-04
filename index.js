const express = require("express")
const cors = require('cors')
const fetch = require('node-fetch')
require('dotenv').config()
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

let port = process.env.PORT || 3000

app.get('/', (req, res) => {
    return res.send('Hello')
})

app.post('/getData', (req, res) => {
    let url = `${process.env.BASE_PATH}${req.body.path}?api_key=${process.env.API_KEY}`
    if (req.body.page) {
        url = url + `&page=${req.body.page}`
    }
    if (req.body.region) {
        url = url + `&region=${req.body.region}`
    }
    if (req.body.query) {
        url = url + `&query=${encodeURI(req.body.query)}`
    }
    if (req.body.append_to_response) {
        url = url + `&append_to_response=${req.body.append_to_response}`
    }
    url = url + `&language=${req.query.language}`
    fetch(url)
        .then(response => response.json())
        .then(json => res.json(json))
})

function notFound(req, res, next) {
    res.status(404)
    const error = new Error('Not Found')
    next(error)
}
function errorHandler(error, req, res, next) {
    res.status(res.statusCode || 500)
    res.json({
        message: error.message
    })
}
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
})