async function connect(){
    if(global.connection 
        && global.connection.state !== 'disconnected')
       return global.connection;
   
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection(
        {
            host: '54.91.193.137', user: 'libertas',
            password: '123456', database: 'libertas5per'
        }
    );
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}
exports.get = async (req, res, next) => {
   const conn = await connect();
   // MELHORIA: Adicionado o campo 'email' na consulta SQL
   const [rows] = await conn.query('SELECT idpessoa, nome, telefone, email FROM pessoa order by nome;');
   res.status(200).send(rows);
};

exports.post = async (req, res, next) => {
    const conn = await connect();
    // MELHORIA: Adicionado 'email' na desestruturação do corpo da requisição
    let { nome, telefone, email } = req.body; 

    // MELHORIA (SQL Injection): Substituímos as variáveis diretas '${nome}' por '?'
    // Isso faz com que o driver do MySQL limpe os dados antes de executar, impedindo ataques.
    let sql = `INSERT INTO pessoa (nome, telefone, email) VALUES (?, ?, ?)`;
    
    // MELHORIA: Os valores são passados em um array como segundo argumento
    await conn.query(sql, [nome, telefone, email]);
    res.status(201).send(`{"resultado": true}`);
};
  
exports.put = async (req, res, next) => {
    const conn = await connect();
    let id = req.params.id;
    // MELHORIA: Adicionado 'email' para permitir a atualização deste campo
    let { nome, telefone, email } = req.body;

    // MELHORIA (SQL Injection): Usando '?' para todos os parâmetros, inclusive o ID no WHERE
    let sql = `UPDATE pessoa SET nome = ?, telefone = ?, email = ? WHERE idpessoa = ?`;
    
    // MELHORIA: Ordem dos valores no array deve seguir a ordem das '?' no SQL
    await conn.query(sql, [nome, telefone, email, id]);
    res.status(201).send(`{"resultado": true}`);
};
  
exports.delete = async (req, res, next) => {
    const conn = await connect();
    let id = req.params.id;

    // MELHORIA (SQL Injection): Protegendo o ID da exclusão contra comandos maliciosos
    let sql = `DELETE FROM pessoa WHERE idpessoa = ?`;
    
    await conn.query(sql, [id]);
    res.status(201).send(`{"resultado": true}`);
};
  
  
exports.getById = async(req, res, next) => {
    let id = req.params.id;
    const conn = await connect();

    // MELHORIA (SQL Injection): Protegendo a busca por ID
    // MELHORIA: O SELECT * agora trará o email automaticamente se a coluna existir
    const [rows] = await conn.query(`SELECT * FROM pessoa WHERE idpessoa = ?`, [id]);
    
    if (rows.length > 0) {
        res.status(200).send(rows[0]);
    } else {
        res.status(404).send(`{"resultado": false}`);
    }
};
