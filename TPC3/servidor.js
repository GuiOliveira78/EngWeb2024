var http = require('http')
var url = require('url')
var axios = require('axios')
var fs = require('fs')
var templates = require('./templates')
var static = require('./static.js')    


http.createServer((req, res) => {
    console.log(req.method + " " + req.url);

    if(req.url == '/'){
        res.write("<div style='text-align: center;'><h1>Cinema</h1></div>");
        res.write("<div style='text-align: center;'>");
        res.write("<h3> <a href='/filmes'>Lista de Filmes</a> </h3>");
        res.write("<h3> <a href='/generos'>Lista de Generos</a>  </h3>");
        res.write("<h3> <a href='/atores'>Lista de Atores</a>  </h3>");
        res.write("</div>");
        res.end();
    }else if(req.url == '/filmes'){
        axios.get("http://localhost:3000/filmes")
            .then(resp =>{
                res.writeHead(200, {"Content-Type" : "text/html; charset=utf-8"})
                html = templates.filmes(resp.data)
                res.write(html)
                res.end()
            })
            .catch(erro =>{
                res.writeHead(500, {"Content-Type" : "text/html; charset=utf-8"})
                res.write("<p>Ocorreu um erro: " + erro + "</p>")
                res.end()
            })
            
    }else if(/\/filmes\/idFilme\/\w+$/i.test(req.url)){
        console.log('aqui')
        id = req.url.split('/')[3]
        console.log('aqui2')
        axios.get("http://localhost:3000/filmes?idFilme=" + id)
            .then(resp =>{
                res.writeHead(200, {"Content-Type" : "text/html; charset=utf-8"})
                html = templates.filme(resp.data)
                res.write(html)
                res.end()
            })
            .catch(erro =>{
                res.writeHead(500, {"Content-Type" : "text/html; charset=utf-8"})
                res.write("<p>Ocorreu um erro: " + erro + "</p>")
                res.end()
            })

    }else if(req.url == '/generos'){
        axios.get("http://localhost:3000/generos")
            .then(resp =>{
                res.writeHead(200, {"Content-Type" : "text/html; charset=utf-8"})
                html = templates.generos(resp.data)
                res.write(html)
                res.end()
            })
            .catch(erro =>{
                res.writeHead(500, {"Content-Type" : "text/html; charset=utf-8"})
                res.write("<p>Ocorreu um erro: " + erro + "</p>")
                res.end()
            })
    
    }else if(req.url == '/atores'){
        axios.get("http://localhost:3000/atores")
            .then(resp =>{
                res.writeHead(200, {"Content-Type" : "text/html; charset=utf-8"})
                html = templates.atores(resp.data)
                res.write(html)
                res.end()
            })
            .catch(erro =>{
                res.writeHead(500, {"Content-Type" : "text/html; charset=utf-8"})
                res.write("<p>Ocorreu um erro: " + erro + "</p>")
                res.end()
            })
    }else if(req.url == '/w3.css'){
        fs.readFile("./w3.css", (erro, dados) =>{
            res.writeHead(200,{'Content-Type' : 'text/css'})
            res.write(dados)
            res.end()
            })
    }else{
        res.writeHead(400,{'Content-Type' : 'text/html; charset=utf-8'})
        res.write("<p>Erro: Pedido não suportado</p>")
        res.write("<pre>" + req.url + "</pre>")
        res.end()
    }
}).listen(2702)

console.log("Servidor à escuta na porta 2702...")
