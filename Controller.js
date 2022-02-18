const express = require('express');
const cors = require('cors');

const models = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

let cliente = models.Cliente;
let itemPedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;

app.get('/', function(req, res){
    res.send("Olá mundo");
});

app.get('/clientes', async(req, res) =>{
    await cliente.create(
        req.body
    ).then(function(){
       return res.json({
            error: false,
            message: "Cliente registrado com sucesso!" 
       })
   }).catch(function(erro){
       return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
   })
   });
});

app.post('/servicos', async(req, res) =>{
    await servico.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Serviço criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
           error: true,
            message: "Foi impossível se conectar." 
        })
    });

});

app.get('/pedidos', async(req, res) =>{
    await pedido.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Pedido criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
           error: true,
            message: "Foi impossível se conectar." 
        })
    });
    
});

app.get('/itemPedidos', async(req, res) =>{
    await itemPedido.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Pedido completado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
           error: true,
            message: "Foi impossível se conectar." 
        })
    });
    
});

let port = process.env.PORT || 3001;

app.listen(port, (req,res)=>{
    console.log("Servidor ativo: http://localhost:3001");
}) //requisição feita pelo usuário, resposta enviada pelo controller

