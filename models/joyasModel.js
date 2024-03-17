const format = require('pg-format');
const { pool } = require('../controller/controller.js')

const getJoyas = async ({ limits = 10, page = 1, order_by = "id_ASC" }) => {

    try {
        let consulta = "SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s"

        const [campo, direccion] = order_by.split("_");
        const offset = Math.abs((page - 1) * limits)

        const formattedQuery = format(consulta, campo, direccion, limits, offset);
        const { rows: joyas } = await pool.query(formattedQuery)
        return joyas

    }catch(error){
        console.error(error.message)
        throw error.message;
    }
    }

const getJoyasFiltro = async ({ precio_min, precio_max, categoria, metal }) => {
    try{
        let filtros = []
        if (precio_min) filtros.push(`precio >= ${precio_min}`)
        if (precio_max) filtros.push(`precio <= ${precio_max}`)
        if (categoria) filtros.push(`categoria = '${categoria}'`)
        if (metal) filtros.push(`metal = '${metal}'`)

        let consulta = "SELECT *, SUM(stock) as totalStock FROM inventario"
        if (filtros.length > 0) {
            filtros = filtros.join(" AND ")
            consulta += ` WHERE ${filtros}`
        }
            const { rows: joyas } = await pool.query(consulta)
        return joyas

    }catch(error){
        console.error(error.message)
        throw error.message;
    }
    }

const getJoya = async (id) => {
    try {
        let consulta = "SELECT * FROM inventario WHERE id = $1"
        const values = [id]
        const { rows } = await pool.query(consulta, values)
    return rows
    } catch(error){
        console.error(error.message)
        throw error.message;
    } 
    }

const formatHATEOAS = (joyas) => {

   const totalStock = joyas.reduce((anterior, actual) => anterior + actual.stock, 0);

    try{
        const results = joyas.map((m) => { 
            return {
                name: m.nombre,
                href: `http://localhost:3000/joyas/joya/${m.id}`,
            }
            
            }).slice(0, joyas.length )
                const totalJoyas = joyas.length
                const HATEOAS = {
                    totalJoyas,
                    totalStock,
                    results,
                }
                return HATEOAS

        }catch(error){
        console.error(error.message)
        throw error.message;
    }

    }

////// Exportamos las funciónes
module.exports = { getJoyas, formatHATEOAS, getJoyasFiltro, getJoya }