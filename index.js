const express = require('express')
const app = express()

//////////////////
app.use((req, res, next) => {
    console.log('Request Type:', req.method, '| Time:', Date(),'| Request URL:', req.originalUrl )
    next();
  });  
/////////////////

app.listen(3000, console.log('Server ON'))

app.get("/home", (req, res) => {
    res.send("Test OK Express Js")
})

const { getJoyas, formatHATEOAS, getJoyasFiltro, getJoya } = require('./models/joyasModel.js')

app.get('/joyas', async (req, res) => {
    try {
        const queryStrings = req.query
        const joyas = await getJoyas(queryStrings)
        const HATEOAS = await formatHATEOAS(joyas)
        //res.json(joyas)
        //res.json(HATEOAS);
        res.status(200).json(HATEOAS);

    }catch(error){
        res.status(500).json({error});
    }
})

app.get('/joyas/filtros', async (req, res) => {
    try{ 
        const queryStrings = req.query
        const joyas = await getJoyasFiltro(queryStrings)
        //res.json(joyas)
        res.status(200).json(joyas);

    }catch(error){
        res.status(500).json({error});
    }
})

app.get('/joyas/joya/:id', async (req, res) => {
    try{
        const { id } = req.params
        const joya = await getJoya(id)
        //res.json(joya)
        res.status(200).json(joya);

    }catch(error){
        res.status(500).json({error});
    }
    })

//////// rutas desconocidas //////////////////////////////
app.get("*", (req, res) => {
    res.status(404).send("ERROR: Esta pagina no existe!!")
    })