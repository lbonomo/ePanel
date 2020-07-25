const sql = require('mssql')
const fs = require('fs')
const xsql = require('@lbonomo/xsql')
// Leo la configuración
const config = require('config')
const sqlConfig = config.mssql
const dataPath = config.data_path

//  Hago la consulta
async function query (sqlQuery, sqlConfig) {
  try {
    await sql.connect(sqlConfig)
    const result = await sql.query(sqlQuery)
    sql.close()
    const message = result.recordsets[0]
    return {
      status: 'success',
      message: message
    }
  } catch (error) {
    // Si no se puede conectar... timeout, login,...
    return {
      status: 'failure',
      message: `Algo salio mal: ${error}`
    }
  }
}

// Query sync
async function QurySync (sqlQuery, sqlConfig) {
  const data = await query(sqlQuery, sqlConfig)
  SaveTurnos(data)
}

// Try to read ${dataPath}/query.xsql
const queryFile = `${dataPath}/query.xsql`
if (fs.existsSync(queryFile)) {
  const sqlQuery = xsql(fs.readFileSync(queryFile, 'utf8'))
  QurySync(sqlQuery, sqlConfig)
} else {
  console.log(`No se encontro el archivo ${queryFile}`)
}

// Escribo data.json
const SaveTurnos = (data) => {
  if (data.status === 'success') {
    fs.writeFileSync(`${dataPath}/data.json`, JSON.stringify(data.message, null, '\t'), 'utf8')
  } else {
    console.log(data.message)
  }
}
