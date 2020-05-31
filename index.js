const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const dirFileProduto = __dirname+"/produto.json";

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.get("/produto",(req,res)=>{
    fs.exists(dirFileProduto,(existe)=>{
        if(existe){
            fs.readFile(dirFileProduto,{encoding:"UTF-8"},(err,dados)=>{
                if(err){
                    return console.log(err);
                }
                res.status(200);
                res.send(dados);
                res.end();
            });
        }else{
            fs.writeFile(dirFileProduto,"[]",(err)=>{
                if(err){
                    console.log(err);
                }
                res.end();
            });
        }
    });
});

app.get("/produto/:id",(req,res)=>{
    fs.exists(dirFileProduto,(existe)=>{
        if(existe){
            fs.readFile(dirFileProduto,{encoding:"UTF-8"},(err,dados)=>{
                if(err){
                    return console.log(err);
                }
                let json = JSON.parse(dados);
                res.status(200);
                res.send(json.find((item)=>item.id==req.params.id));
                res.end();
            });
        }else{
            fs.writeFile(dirFileProduto,"[]",(err)=>{
                if(err){
                    console.log(err);
                }
                res.end();
            });
        }
    });
});

app.post("/produto",(req,res)=>{
    fs.readFile(dirFileProduto,(err,dados)=>{
        if(err){
            res.status(400);
            res.send("Produto não foi salvo.");
            res.end();
            return console.log(err);
        }
        let produtos = JSON.parse(dados);
        let json = req.body;
        let numeroMaior = 1;
        produtos.forEach((item)=>{
            numeroMaior = item.id>numeroMaior?item.id:numeroMaior;
        });
        json.id = parseInt(numeroMaior)+1;
        produtos.push(json);
        fs.writeFile(dirFileProduto,JSON.stringify(produtos),(err)=>{
            if(err){
                res.status(400);
                res.send("Produto não foi salvo.");
                res.end();
                return console.log(err);
            }
            res.status(200);
            res.send("Produto Salvo com sucesso!");
            res.end();
        });
    });
    
});

app.put("/produto/:id",(req,res)=>{
    fs.readFile(dirFileProduto,(err,dados)=>{
        if(err){
            res.status(400);
            res.send("Produto não foi editado.");
            res.end();
            return console.log(err);
        }
        let produtos = JSON.parse(dados);
        let indice = -1;
        let produto = produtos.find((item,index)=>{
            
            if(item.id==req.params.id){
                indice = index;
                return true;
            }else{
                return false;
            }
        });
        
        if(indice==-1){
            res.status(400);
            res.send("O produto com o indice informado não existe!");
            res.end();
            return ;
        }
        produto = req.body;
        produto.id = req.params.id;
        produtos[indice] = produto;
        fs.writeFile(dirFileProduto,JSON.stringify(produtos),(err)=>{
            if(err){
                res.status(400);
                res.send("Produto não foi editado.");
                res.end();
                return console.log(err);
            }
            res.status(200);
            res.send("Produto Editado com sucesso!");
            res.end();
        });
    });
});

app.delete("/produto/:id",(req,res)=>{
    fs.readFile(dirFileProduto,(err,dados)=>{
        if(err){
            res.status(400);
            res.send("Produto não foi excluído.");
            res.end();
            return console.log(err);
        }
        let produtos = JSON.parse(dados);
        let indice = -1;
        let produto = produtos.find((item,index)=>{
            
            if(item.id==req.params.id){
                indice = index;
                return true;
            }else{
                return false;
            }
        });
        
        if(indice==-1){
            res.status(400);
            res.send("O produto com o indice informado não existe!");
            res.end();
            return ;
        }

        produtos.splice(indice,1);

        fs.writeFile(dirFileProduto,JSON.stringify(produtos),(err)=>{
            if(err){
                res.status(400);
                res.send("Produto não foi excluído.");
                res.end();
                return console.log(err);
            }
            res.status(200);
            res.send("Produto Excluído com sucesso!");
            res.end();
        });
    });
});

app.listen(3000);

