const format = require('pg-format');
const { pool } = require('../controller/controller.js')

const getJoyas = async ({ limits = 10, page = 1, order_by = "id_ASC" }) => {
    
    let consulta = "SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s"

    const [campo, direccion] = order_by.split("_");
    const offset = Math.abs((page - 1) * limits)

    const formattedQuery = format(consulta, campo, direccion, limits, offset);
    const { rows: joyas } = await pool.query(formattedQuery)
    return joyas
    }

const getJoyasFiltro = async ({ precio_min, precio_max, categoria, metal }) => {
    let filtros = []
    if (precio_min) filtros.push(`precio >= ${precio_min}`)
    if (precio_max) filtros.push(`precio <= ${precio_max}`)
    if (categoria) filtros.push(`categoria = '${categoria}'`)
    if (metal) filtros.push(`metal = '${metal}'`)

    let consulta = "SELECT * FROM inventario"
    if (filtros.length > 0) {
        filtros = filtros.join(" AND ")
        consulta += ` WHERE ${filtros}`
    }
        const { rows: joyas } = await pool.query(consulta)
    return joyas
    }

const getJoya = async (id) => {
        
    let consulta = "SELECT * FROM inventario WHERE id = $1"
        const values = [id]
        const { rows } = await pool.query(consulta, values)
    return rows
    }

const formatHATEOAS = (joyas) => {
    const results = joyas.map((m) => {
    return {
        name: m.nombre,
        href: `http://localhost:3000/joyas/joya/${m.id}`,
    }
    }).slice(0, joyas.length)
        const total = joyas.length
        const HATEOAS = {
            total,
            results,
        }
        return HATEOAS
    }

////// Exportamos las funciónes
module.exports = { getJoyas, formatHATEOAS, getJoyasFiltro, getJoya }