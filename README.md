# GerenciamentoDePessoas

Relatório de Entrega: Sistema de Gerenciamento de Pessoas

Aluno: Caio da Silva Melo

RA: 007206

Repositório GitHub: https://github.com/caiosxlva/GerenciamentoDePessoas

1. Descrição Teórica: SQL Injection
O que é SQL Injection?
O SQL Injection (Injeção de SQL) é uma das vulnerabilidades mais comuns e perigosas em aplicações web. Ela ocorre quando um invasor consegue inserir ou "injetar" comandos SQL maliciosos nos campos de entrada de um formulário (como Nome ou Telefone). Se o sistema não estiver protegido, o banco de dados executa esses comandos como se fossem legítimos, permitindo que o invasor apague tabelas, roube senhas ou acesse dados confidenciais de outros usuários.

Como o código foi protegido?
Para proteger este projeto, utilizei a técnica de Prepared Statements (Declarações Preparadas) com o uso de Placeholders (o caractere ?).

Em vez de concatenar as variáveis diretamente na string de comando SQL, como no exemplo inseguro:
"INSERT INTO pessoa (nome) VALUES ('" + nome + "')"

Utilizei a passagem de parâmetros via array no controlador:
conn.query("INSERT INTO pessoa (nome, telefone, email) VALUES (?, ?, ?)", [nome, telefone, email])

Por que isso protege?
Quando usamos o ?, o driver do banco de dados trata a entrada do usuário estritamente como um dado (texto) e nunca como um comando. Se um usuário digitar algo como '; DROP TABLE pessoa;--, o banco de dados simplesmente salvará esse texto literalmente no campo de nome, sem nunca executar o comando de exclusão.

