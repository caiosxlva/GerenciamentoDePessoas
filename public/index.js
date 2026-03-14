listar();

function novo() {
    document.getElementById("conteudo").style.display = "none";
    document.getElementById("formulario").style.display = "block";
    document.getElementById("txtnome").value = "";
    document.getElementById("txttelefone").value = "";
    // 1. ADICIONADO: Limpa o campo de email ao clicar em novo
    document.getElementById("txtemail").value = ""; 
}


function salvar() {
    if (window.idEdicao) {
        // Se existe um ID guardado, ele chama a função de alterar (PUT)
        executarAlterar(window.idEdicao);
    } else {
        // Se não tem ID, é um cadastro novo (POST)
        inserir();
    }
}

async function executarAlterar(id) {
    const dados = {
        nome: document.getElementById("txtnome").value,
        telefone: document.getElementById("txttelefone").value,
        email: document.getElementById("txtemail").value
    };

    await fetch("/pessoa/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    window.idEdicao = null; // Limpa o ID
    document.getElementById("formulario").style.display = "none";
    document.getElementById("conteudo").style.display = "block";
    listar();
}

async function listar() {
    document.getElementById("conteudo").innerHTML = "Carregando...";
    const resp = await fetch("/pessoa");
    const dados = await resp.json();

    let tabela = `<table class="table table-striped table-hover mt-3">
                    <thead class="table-dark">
                        <tr>
                            <th>Nome</th><th>Telefone</th><th>E-mail</th><th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>`;

    for (let i=0; i<dados.length; i++) {
        tabela += `<tr>
                    <td>${dados[i].nome}</td>
                    <td>${dados[i].telefone}</td>
                    <td>${dados[i].email || ""}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="prepararEditar(${dados[i].idpessoa})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="excluir(${dados[i].idpessoa})">Excluir</button>
                    </td>
                   </tr>`;
    }
    tabela += `</tbody></table>`;
    document.getElementById("conteudo").innerHTML = tabela;
}



async function consultar() {

    document.getElementById("conteudo").innerHTML = "aguarde...";
    const resp = await fetch("/pessoa/222", {
        method: "GET",
        headers: {
            "Content-Type" : "application/json"
        }

    });
    if (!resp.ok) {
        console.log("erro "+resp.status);

    }

    //se fosse JSON, converte a resposta pra JSON

    //const dados = await resp.json();

    const retorno = await resp.text();
    document.getElementById("conteudo").innerHTML = retorno;

}



async function inserir() {
    document.getElementById("conteudo").innerHTML = "aguarde...";

    // 4. ADICIONADO: Capturando o valor do campo txtemail que apareceu no seu HTML
    const novo = {
        nome: document.getElementById("txtnome").value,
        telefone: document.getElementById("txttelefone").value,
        email: document.getElementById("txtemail").value 
    }

    const resp = await fetch("/pessoa", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(novo)
    });

    if (!resp.ok) {
        console.log("erro "+resp.status);
    }

    const retorno = await resp.text();

    document.getElementById("conteudo").style.display = "block";
    document.getElementById("formulario").style.display = "none";
    listar();
}



async function alterar() {

    document.getElementById("conteudo").innerHTML = "aguarde...";

    const dados = {
        nome: "Bill Gates",
        email: "bill@microsoft.com"

    }
    const resp = await fetch("/pessoa/123", {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(dados)

    });



    if (!resp.ok) {
        console.log("erro "+resp.status);
    }



    //se fosse JSON, converte a resposta pra JSON

    //const dados = await resp.json();

    const retorno = await resp.text();
    document.getElementById("conteudo").innerHTML = retorno;
}



async function excluir() {

    document.getElementById("conteudo").innerHTML = "aguarde...";
    const resp = await fetch("/pessoa/123", {
        method: "DELETE",
        headers: {
            "Content-Type" : "application/json"
        }

    });

    if (!resp.ok) {
        console.log("erro "+resp.status);
    }

    //se fosse JSON, converte a resposta pra JSON
    //const dados = await resp.json();

    const dados = await resp.text();
    document.getElementById("conteudo").innerHTML = dados;

}

// Função que busca os dados atuais e joga no formulário
async function prepararEditar(id) {
    const resp = await fetch("/pessoa/" + id);
    const pessoa = await resp.json();

    // Preenche os inputs com o que veio do banco (Usa o seu GetById do Controller)
    document.getElementById("txtnome").value = pessoa.nome;
    document.getElementById("txttelefone").value = pessoa.telefone;
    document.getElementById("txtemail").value = pessoa.email;
    
    // Guarda o ID num lugar escondido (ou numa variável global) para o Salvar saber que é uma alteração
    window.idEdicao = id; 

    document.getElementById("conteudo").style.display = "none";
    document.getElementById("formulario").style.display = "block";
}

// Função de excluir (chamada pelo botão vermelho)
async function excluir(id) {
    if (confirm("Deseja realmente excluir este registro?")) {
        await fetch("/pessoa/" + id, { method: "DELETE" });
        listar(); // Recarrega a lista após excluir
    }
}


function cancelar() {
    document.getElementById("formulario").style.display = "none";
    document.getElementById("conteudo").style.display = "block";
    window.idEdicao = null; // Reseta qualquer edição pendente
}