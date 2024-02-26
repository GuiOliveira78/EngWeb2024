// Dependências
var http = require('http')
var url = require('url')
var axios = require('axios')

// Criação do servidor
http.createServer((req, res) => {
    // Demonstração de todos os pedidos
    console.log(req.method + " " + req.url);

    var q = url.parse(req.url, true);
    res.writeHead(200, { 'Content-Type': 'text/html; charset= utf-8' }); // Formato html

    // Página Inicial
    if (req.url == "/") {
        res.write("<div style='text-align: center;'><h1>Escola de Música</h1></div>");
        res.write("<div style='text-align: center;'>");
        res.write("<h3> <a href='/alunos'>Lista de Alunos</a> </h3>");
        res.write("<h3> <a href='/cursos'>Lista de Cursos</a>  </h3>");
        res.write("<h3> <a href='/instrumentos'>Lista de Instrumentos</a>  </h3>");
        res.write("</div>");
        res.end();
    }

    // Lista dos alunos
    else if (req.url == "/alunos") {
        axios.get("http://localhost:3000/alunos?_sort=nome").then((resp) => {
            var data = resp.data;
            res.write("<div style='text-align: center;'><h1>Lista de alunos</h1></div>");
            res.write("<ol>");
            for (i in data) { // Adicionar aluno à lista
                res.write("<li> <a href='/alunos/" + data[i].id + "'>" + data[i].nome + ", ID: " + data[i].id + "</a></li>");
            }
            res.write("</ul>");
            res.write("<h3><a href='/'> Voltar à pagina inicial </a> </h3>") 
        }).catch((erro) => {
            console.log("Erro: " + erro);
            res.write("<p>" + erro + "</p>");
        })
    }

    // Página de um aluno em específico
    else if (q.pathname.startsWith("/alunos/")) {
        var alunoID = req.url.split("/")[2] // Pesquisa do aluno em específico
        axios.get("http://localhost:3000/alunos/" + alunoID).then((resp) => {
            aluno = resp.data;
            res.write("<div style='text-align: center;'><h1>Aluno ID:  " + aluno.id + "</h1></div>");
            res.write("<p>Nome: " + aluno.nome + "</p>");
            res.write("<p>Data de Nascimento: " + aluno.dataNasc + "</p>");
            res.write("<a href='/cursos/" + aluno.curso + "'>Curso: " + aluno.curso + "</a>");
            res.write("<p>Ano: " + aluno.anoCurso + "</p>");
            res.write("<a href='/instrumentos/" + aluno.instrumento + "'>Instrumento: " + aluno.instrumento + "</a>");
            res.write("<h3><a href='/alunos'> Voltar à lista de alunos </a> </h3>");
            res.end();

        }).catch((erro) => {
            console.log("Erro: " + erro);
            res.write("<p>" + erro + "</p>");
        })
    }

    // Lista dos cursos
    else if (req.url == "/cursos") {
        axios.get("http://localhost:3000/cursos?_sort=designacao").then((resp) => {
            var data = resp.data;
            res.write("<div style='text-align: center;'><h1>Lista de cursos</h1></div>");
            res.write("<ol>");
            for (i in data) { // Colocar cada aluno na lista
                res.write("<li> <a href='/cursos/" + data[i].id + "'>" + data[i].designacao + ", ID: " + data[i].id + "</a></li>");
            }
            res.write("</ol>");
            res.write("<h3><a href='/'> Voltar à pagina inicial </a> </h3>")
            res.end();
        }).catch((erro) => {
            console.log("Erro: " + erro);
            res.write("<p>" + erro + "</p>");
        })
    }

    // Página de um curso em específico
    else if (q.pathname.startsWith("/cursos/")) {
        var cursoID = req.url.split("/")[2];
        axios.get("http://localhost:3000/cursos/" + cursoID).then((resp) => {
            curso = resp.data;
            res.write("<div style='text-align: center;'><h1>Curso ID: " + curso.id + "</h1></div>");
            res.write("<p>Designação: " + curso.designacao + "</p>");
            res.write("<p>Duração: " + curso.duracao + "</p>");
            res.write("<a href='/instrumentos/" + curso.instrumento["#text"] + "'>Instrumento: " + curso.instrumento["#text"] + "</a>");
            res.write("<h3><a href='/cursos'> Voltar à lista de cursos </a> </h3>")
            res.end();

        }).catch((erro) => {
            console.log("Erro: " + erro);
            res.write("<p>" + erro + "</p>");
        })
    }

    // Lista dos instrumentos
    else if (req.url == "/instrumentos") {
        axios.get("http://localhost:3000/instrumentos?_sort=%23text").then((resp) => {
            var data = resp.data;
            res.write("<div style='text-align: center;'><h1>Lista de instrumentos</h1></div>");
            res.write("<ol>");
            data.forEach(i => { // Adicionar instrumento à lista
                res.write("<li> <a href='instrumentos/" + i["#text"] + "'>" + i["#text"] + "</a></li>");
            });
            res.write("</ol>");
            res.write("<h3><a href='/'> Voltar à pagina inicial </a> </h3>")
            res.end();

        }).catch((erro) => {
            console.log("Erro: " + erro);
            res.write("<p>" + erro + "</p>");
        })
    }

    // Página de um instrumento em específico
    else if (q.pathname.startsWith("/instrumentos/")) {
        var instrumentoNOME = req.url.split("/")[2]
        axios.get("http://localhost:3000/instrumentos?%23text=" + instrumentoNOME).then((resp) => {
            instrumento = resp.data[0];
            res.write("<div style='text-align: center;'><h1>" + instrumento["#text"] + "</h1></div>");
            res.write("<h3>Instrumento: " + instrumento["#text"] + "</h3>");
            res.write("<h3>Id: " + instrumento["id"] + "</h3>");
            res.write("<h3><a href='/instrumentos'> Voltar à lista de instrumentos </a> </h3>")

        }).catch((erro) => {
            console.log("Erro: " + erro);
            res.write("<p>" + erro + "</p>");
        })
    }

    else { 
        res.write("<div style='text-align: center;'><h1> Operação não suportada </h1></div>");
        res.end();
    }

}).listen(3001)

console.log("Servidor à escuta na porta 3001");