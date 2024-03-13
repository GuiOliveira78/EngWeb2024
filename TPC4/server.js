// alunos_server.js
// EW2024 : 04/03/2024
// by jcr

var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates')          // Necessario criar e colocar na mesma pasta
var static = require('./static.js')             // Colocar na mesma pasta

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

// Server creation

var compositoresServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /compositores --------------------------------------------------------------------
                if(req.url == '/' || req.url == '/compositores'){
                    axios.get("http://localhost:3000/compositores?_sort=nome")
                        .then(resp =>{
                            compositores = resp.data
                            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write(templates.compositoresListPage(compositores,d))
                            res.end()
                        })
                        .catch(erro =>{
                            res.writeHead(501, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter a lista de compositores: " + erro + "</p>")
                            res.end()
                        })
                }

                // GET /compositores/:id --------------------------------------------------------------------
                else if(/\/compositores\/(\w+)$/i.test(req.url)){
                    id = req.url.split('/')[2]
                    axios.get("http://localhost:3000/compositores/" + id)
                        .then(resp =>{
                            compositor = resp.data
                            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write(templates.compositorPage(compositor,d))
                            res.end()
                        })
                        .catch(erro =>{
                            res.writeHead(502, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter a informação do compositor " + id + '::' + erro + "</p>")
                            res.end()
                        })

                }

                // GET /periodos
                else if(req.url == '/periodos' ){
                    axios.get("http://localhost:3000/periodos?_sort=nome")
                        .then(resp =>{
                            periodos = resp.data
                            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write(templates.periodosListPage(periodos,d))
                            res.end()
                        })
                        .catch(erro =>{
                            res.writeHead(503, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter a lista de periodos: " + erro + "</p>")
                            res.end()
                        })
                }

                // GET /periodos/{id}
                else if(/\/periodos\/(\d+)$/i.test(req.url)){
                    id = req.url.split('/')[2]
                    axios.get("http://localhost:3000/periodos/" + id)
                        .then(resp =>{
                            periodo = resp.data
                            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write(templates.periodoPage(periodo,d))
                            res.end()
                        })
                        .catch(erro =>{
                            res.writeHead(504, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter a informação do periodo " + id + '::' + erro + "</p>")
                            res.end()
                        })

                }

                // GET ? -> Lancar um erro
                else{
                    res.writeHead(502, {'Content-Type' : 'text/html; charset=utf-8'})
                    res.write("<p>GET request não suportado: " + req.url + "</p>")
                    res.end()
                }
                break

            default: 
                // Outros metodos nao sao suportados
                res.writeHead(600, {'Content-Type' : 'text/html; charset=utf-8'})
                res.write("<p>Método não suportado: " + req.method + "</p>")
                res.end
                break
        }
    }
})

compositoresServer.listen(3050, ()=>{
    console.log("Servidor Ã  escuta na porta 3050...")
})

