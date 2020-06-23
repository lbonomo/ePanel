const sql = require('mssql');
const fs = require('fs');
const xsql = require('@lbonomo/xsql');

// Leo la configuración
const config = require('config');
const sql_config = config.mssql;

//  Hago la consulta
async function query(sql_query, sql_config) {
  try {
    await sql.connect(sql_config);
    let result = await sql.query(sql_query);
    sql.close();
    let message = result.recordsets[0];
    return {
      status: "success",
      message: message
    };
  } catch (error) {
    // Si no se puede conectar... timeout, login,...
    return {
      status: "failure",
      message: `Algo salio mal: ${error}`
    };
  }
}

// Leo turnos/query.sql
let query_file = './turnos/query.xsql';
if ( fs.existsSync(query_file) ) {
  const sql_query = xsql(fs.readFileSync(query_file, 'utf8'));
  // console.log(sql_query);
  // Esto queda feo... pero es una forma de autoejecutar una funcion
  (async() => {
    const data = await query(sql_query, sql_config);
    SaveTurnos(data);
  })();
} else {
  console.log("No se encontro el archivo ./turnos/query.xsql");
}

// Escribo data.json
const SaveTurnos = (data) => {
  if ( data.status === 'success' ) {
    fs.writeFileSync('./turnos/data.json', JSON.stringify(data.message, null, '\t'), 'utf8')
  } else {
    console.log(data.message);
  }
}
