const express = require('express');
const cors = require('cors');

const {Sequelize} = require('./models');

const models = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

let cliente = models.Cliente;
let itemPedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;
let compra = models.Compra;
let itemCompra = models.ItemCompra;
let produto = models.Produto;

app.get('/', function(req, res){
    res.send("Olá mundo");
});

app.get('/clientes', async(req, res) =>{  //registro de clientes
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

app.get('/listaclientes', async(req, res) =>{  //listagem de todos os clientes
    await cliente.findAll({
        // raw: true //achar todos os clientes sem ordem específica
        order: [['id', 'ASC']]
    }).then(function(clientes){
        res.json(clientes)
    });
});

app.get('/ofertaclientes', async(req, res) =>{  //contagem de quantos clientes estão listados
    await cliente.count('id').then(function(clientes){
        res.json({clientes})
    });
});

app.post('/servicos', async(req, res) =>{  //cadastro de serviços
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

app.get('/pedidos', async(req, res) =>{  //cadastro de pedidos
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

app.get('/listapedidos', async(req, res) =>{  //listagem de todos os pedidos registrados
    await pedido.findAll({
        // raw: true
        order: [['id', 'DESC']]
    }).then(function(pedidos){
        res.json(pedidos)
    });
});

app.get('/ofertapedidos', async(req, res) =>{  //contagem de quantos pedidos estão listados
    await pedido.count('id').then(function(pedidos){
        res.json({pedidos})
    });
});

app.get('/itemPedidos', async(req, res) =>{  //criação de um item pedido
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

app.get('/listaservicos', async(req, res)=>{  //listagem de todos os serviços cadastrados
    await servico.findAll({
        //raw: true
        order: [['nome', 'ASC']]
    }).then(function(servicos){
        res.json({servicos})
    });
});

app.get('/ofertaservicos', async(req, res)=>{  //contagem de quantos serviços estão cadastrados
    await servico.count('id').then(function(servicos){
        res.json({servicos});
    });
});

app.get('/servico/:id', async(req, res)=>{  //busca de serviço por seu id
    await servico.findByPk(req.params.id)
    .then(serv =>{
        return res.json({
            error: false,
            serv
        });
    }).catch(function(error){
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível conectar."
        });
    });
});

// app.get('/atualizaservico', async(req, res) =>{
//     await servico.findByPk(1)
//     .then(serv =>{
//         serv.nome = "HTML/CSS/JS";
//         serv.descricao = "Nesse serviço criam-se páginas estáticas e dinâmicas estilizadas."
//         serv.save();
//         res.json({serv});
//     });
// });

app.put('/atualizaservico', async(req, res) =>{  //atualização de serviço já existente
    await servico.update(req.body, {
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Serviço foi alterado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro na alteração do serviço"
        });
    });
});

app.get('/pedidos/:id', async(req, res) =>{  //busca de um pedido por seu id
    await pedido.findByPk(req.params.id, {include: [{all: true}]})
    .then(ped=>{
        return res.json({ped});
    });
});

app.put('/itempedidos/:id/editaritem', async(req, res) =>{  //alteração de um item pedido já existente
    const item ={
        quantidade: req.body.quantidade,
        float: req.body.float //float = valor, coloquei o nome errado no começo e não consegui alterar depois
    };

    if(!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: "Pedido não foi encontrado."
        });
    };

    if(!await servico.findByPk(req.body.ServicoId)){
        return res.status(400).json({
            error: true,
            message: "Serviço não encontrado."
        });
    };

    await itemPedido.update(item, {
        where: Sequelize.and({ServicoId: req.body.ServicoId}, {PedidoId: req.params.id})
    }).then(function(itens){
        return res.json({
            error: false,
            message: "Pedido foi alterado com sucesso.",
            itens
        });
    }).catch(function(erro){
        return res.json({
            error: true,
            message: "Não foi possível alterar."
        });
    });
});

app.get('/clientes/:id', async(req, res) =>{ //busca de um cliente por seu id
    await cliente.findByPk(req.params.id, {include: [{all: true}]})
    .then(cli=>{
        return res.json({cli});
    });
});

app.put('/clientes/:id/editaritem', async(req, res) =>{ //atualização de um cliente já existente
    const item ={
        nome: req.body.nome,
        endereco: req.body.endereco,
        cidade: req.body.cidade,
        uf: req.body.uf,
        nascimento: req.body.nascimento,
        clienteDesde: req.body.clienteDesde
    };

    if(!await cliente.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: "Cliente não foi encontrado."
        });
    };

    await cliente.update(item, {where: {id: req.body.id}})
    .then(function(itens){
        return res.json({
            error: false,
            message: "Cliente foi alterado com sucesso.",
            itens
        });
    }).catch(function(erro){
        return res.json({
            error: true,
            message: "Não foi possível alterar."
        });
    });
});

app.get('/excluircliente/:id', async(req, res) =>{  //exclusão de um cliente
    cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        res.json({
            error: false,
            message: 'Cliente excluído com sucesso!'
        });
    }).catch(function(){
        res.json({
            error: true,
            message: 'Não foi possível excluir o cliente.'
        });
    });
});

app.put('/pedidos/:id/editaritem', async(req, res) =>{  //alteração em um pedido já existente
    const item ={
        dataPedido: req.body.dataPedido,
    };

    if(!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: "Pedido não foi encontrado."
        });
    };

    await pedido.update(item, {where: {id: req.body.id}})
    .then(function(itens){
        return res.json({
            error: false,
            message: 'Pedido alterado com sucesso!',
            itens
        });
    }).catch(function(erro){
        return res.json({
            error: true,
            message: 'Erro ao alterar'
        });
    });
});

//------------DESAFIO (COMPRAS, ITEMCOMPRAS E PRODUTOS)-------------------

//-----------------------------------COMPRA---------------------------------------------

app.get('/cadcompra', async(req, res) =>{  //Cadastro Compra
    await compra.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: 'Compra cadastrada com sucesso!'
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: 'Erro ao cadastrar compra.'
        });
    });
});

app.get('/listacompra', async(req, res) =>{  //Listagem Compra
    await compra.findAll({
         raw: true
    }).then(function(compras){
        res.json(compras)
    });
});

app.put('/compras/:id/editaritem', async(req, res) =>{ //Alteração Compra
    const item = {
        data: req.body.data
    };

    if(!await compra.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Compra não encontrada.'
        });
    };

    await compra.update(item, {where: {id: req.params.id}})
    .then(function(itens){
        return res.json({
            error: false,
            message: 'Compra atualizada com sucesso!',
            itens
        });
    }).catch(function(erro){
        return res.json({
            error: true,
            message: 'Não foi possível alterar a compra'
        });
    });
});

app.get('/compras/:id/excluiritem', async(req, res) =>{  //Exclusão Compra
    await compra.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: 'Compra excluída com sucesso!'
        });
    }).catch(function(){
        return res.json({
            error: true,
            message: 'Não foi possível excluir a compra.'
        });
    });
});

//------------------------------PRODUTO---------------------------------------

app.get('/cadproduto', async(req, res) =>{  //Cadastro Produto
    await produto.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: 'Produto cadastrado com sucesso!'
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: 'Erro ao cadastrar produto'
        });
    });
});

app.get('/listaprodutos', async(req, res) =>{  //Listagem Produto
    await produto.findAll({
        raw: true
    }).then(function(produtos){
        return res.json(produtos)
    }).catch(function(){
        return res.json({
            error: true,
            message: 'Não foi possível listar os produtos existentes'
        });
    });
});

app.put('/produtos/:id/editaritem', async(req, res) =>{  //Alteração Produto
    const item = {
        nome: req.body.nome,
        descricao: req.body.descricao
    };

    if(!await produto.findByPk(req.params.id)){
        res.json({
            error: true,
            message: 'Produto não encontrado'
        });
    };

    await produto.update(item, {where: {id: req.params.id}})
    .then(function(){
        res.json({
            error: false,
            message: 'Produto alterado com sucesso!'
        });
    }).catch(function(){
        res.json({
            error: true,
            message: 'Não foi possível alterar o produto'
        });
    });
});

app.get('/produtos/:id/excluiritem', async(req, res) =>{  //Exclusão Produto
    await produto.destroy({
        where: {id: req.params.id}
    }).then(function(){
        res.json({
            error: false,
            message: 'Produto excluído com sucesso!'
        });
    }).catch(function(){
        res.json({
            error: true,
            message: 'Erro na exclusão do produto.'
        });
    });
});

//------------------------------ITEMCOMPRA------------------------------------

app.get('/itemcompras', async(req, res) =>{  //Cadastro ItemCompra
    await itemCompra.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: 'ItemCompra cadastrado com sucesso!'
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: 'Erro ao cadastrar itemCompra.'
        });
    });
});

app.get('/listaitemcompras', async(req, res) =>{  //Listagem ItemCompra
    await itemCompra.findAll({
        raw: true
    }).then(function(itens){
        res.json(itens)
    }).catch(function(){
        res.json({
            error: true,
            message: 'Erro ao listar itens compras.'
        });
    });
});

app.put('/itemcompras/:id/editaritem', async(req, res) =>{  //Alteração ItemCompra
    const item = {
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if(!await compra.findByPk(req.params.id)){
        res.json({
            error: true,
            message: 'Compra não encontrada.'
        });
    };

    if(!await produto.findByPk(req.body.ProdutoId)){
        res.json({
            error: true,
            message: 'Produto não encontrado.'
        });
    };

    await itemCompra.update(item, 
        {where: Sequelize.and({CompraId: req.body.CompraId}, {ProdutoId: req.body.ProdutoId})})
    .then(function(itens){
        res.json({
            error: false,
            message: 'ItemCompra alterado com sucesso!',
            itens
        });
    }).catch(function(){
        res.json({
            error: false,
            message: 'Falha na alteração do ItemCompra.'
        });
    });
});

app.get('/itemcompras/:id/excluiritem', async(req, res) =>{  //Exclusão ItemCompra
    await itemCompra.destroy({
        where: {CompraId: req.params.id}
    }).then(function(){
        res.json({
            error: false,
            message: 'ItemCompra excluído com sucesso!'
        });
    }).catch(function(){
        res.json({
            error: true,
            message: 'Falha na exclusão de ItemCompra.'
        });
    });
});

let port = process.env.PORT || 3001;

app.listen(port, (req,res)=>{
    console.log("Servidor ativo: http://localhost:3001");
}) //requisição feita pelo usuário, resposta enviada pelo controller

