const express = require('express')
const app = express()
app.listen(3000, console.log('Server ON'))

app.get("/home", (req, res) => {
    res.send("Test OK Express Js")
})

const { getJoyas, formatHATEOAS, getJoyasFiltro, getJoya } = require('./models/joyasModel.js')

app.get('/joyas', async (req, res) => {
    const queryStrings = req.query
    const joyas = await getJoyas(queryStrings)
    const HATEOAS = await formatHATEOAS(joyas)
    //res.json(joyas)
    res.json(HATEOAS);
})

app.get('/joyas/filtros', async (req, res) => {
    const queryStrings = req.query
    const joyas = await getJoyasFiltro(queryStrings)
    res.json(joyas)
    })

app.get('/joyas/joya/:id', async (req, res) => {
    const { id } = req.params
    const joya = await getJoya(id)
    res.json(joya)
    })

//////// rutas desconocidas //////////////////////////////
app.get("*", (req, res) => {
    res.status(404).send("ERROR: Esta pagina no existe!!")
    })