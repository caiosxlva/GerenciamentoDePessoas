const PessoaController = require('./pessoaController');

module.exports = (app) => {
   app.post('/pessoa', PessoaController.post);
   app.put('/pessoa/:id', PessoaController.put);
   app.delete('/pessoa/:id', PessoaController.delete);
   app.get('/pessoa', PessoaController.get);
   app.get('/pessoa/:id', PessoaController.getById);
}
