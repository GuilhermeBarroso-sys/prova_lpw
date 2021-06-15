const express = require("express");
const app = express();
const uuid  = require('uuid');

const port = 3333;
app.use(express.json());
let DB = [
    {
        id: uuid.v4(),
        dataCompra: '2021/05/01',
        localCompra: 'Mercado Livre',
        valor: 2500.00,
        responsavel: 'Guilherme'
    },
    {
        id: uuid.v4(),
        dataCompra: '2021/04/01',
        localCompra: 'Aliexpress',
        valor: 1500.00,
        responsavel: 'Fulano'
    }
];
const verificaCampos = (request,response,next) => {
    const {dataCompra, localCompra, valor, responsavel} = request.body;
    if(dataCompra == undefined || localCompra == undefined || valor == undefined || responsavel == undefined) {
        return response.status(400).json("Error! Um ou mais campo está faltando!");
    }

    next();    
}
app.post('/despesas', verificaCampos, (request, response) => { //A
    const {dataCompra, localCompra, valor, responsavel} = request.body;
    const gasto = {
        id: uuid.v4(),
        dataCompra: dataCompra,
        localCompra: localCompra,
        valor: valor,
        responsavel: responsavel
    }
    DB = [...DB, gasto]
    return response.status(201).json(gasto);
})
app.get('/despesas', (request,response) => { //B
    return response.status(200).json(DB);
})
app.get('/despesas/gastototal', (request,response) => { // D
    let gastoTotal = 0.0;
    DB.forEach(despesa => {
        gastoTotal+=despesa.valor
    });
    return response.status(200).json(`Gasto total: ${gastoTotal.toFixed(2)}`);
    
})
app.get('/despesas/gastoresponsavel', (request,response) => { // E
    const {nome} = request.query;
    const gastos = DB.filter(gasto => gasto.responsavel.toUpperCase() == nome.toUpperCase());

    return response.status(200).json(gastos);
    
})
app.get('/despesas/:id', (request,response) => { // C
    const {id} = request.params;
    const index = DB.findIndex(gasto => gasto.id === id);
    const gasto = (index != -1)
    ? response.status(200).json(DB[index])
    : response.status(404).json("Id inexistente!");
    return gasto;
})


app.listen(port, () => {
    console.log(`Server is Running on port ${port}`);
})