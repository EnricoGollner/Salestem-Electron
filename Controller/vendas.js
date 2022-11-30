// Definições - Loki
let read = require('read-file-utf8')
let loki = require('lokijs')  // Mesmo que "import"
let db = new loki('Views/db.json')
let data = read(__dirname + '/db.json')
db.loadJSON(data)
window.Vue = require('vue')
let vendas = db.getCollection('vendas')
let clientes = db.getCollection('Clientes')
let produtos = db.getCollection('produtos')
let nOldQtdSold = 1

const Swal = require('sweetalert2')

db.save() // Salva o arquivo JSON

class Vendas {
    constructor(model, sNomeClienteOld, sNomeProdutoOld, nQtdVendidaOld, nPrecoVendidoOld) {
        this.model = model;
        this.sNomeClienteOld = sNomeClienteOld;
        this.sNomeProdutoOld = sNomeProdutoOld;
        this.nQtdVendidaOld = nQtdVendidaOld;
        this.nPrecoVendidoOld = nPrecoVendidoOld;
    }

    /**
     * @param {*} oResult 
     */
    _sweetAlert(oResult){
        Swal.fire({
            title: oResult.title,
            text: oResult.text,
            icon: oResult.icon,
            confirmButtonText: oResult.confirmButtonText
        })
    }

    /* _validaNovaVenda(oSale, oProdutoSold, modo) {
        let oResult = {
            title: '',
            text: '',
            icon: '',
            confirmButtonText: '',
            result: false
        }

        oResult.result = true

        return oResult


        

    } */

    /**
     * @param {String} mode 
     * @returns @type {Object}
     */
    /* _updateValoresAntigos(mode){
        let oVendaOld = {
            cliente: '',
            produto: '',
            preco: '',
            qtd: '',
            modo: ''
        }

        let oResult = {
            title: '',
            text: '',
            icon: '',
            confirmButtonText: '',
            result: false
        }

        if (mode == 'edicao') {
            oResult.title = 'Erro ao atualizar a venda'
            oResult.text = 'Não foi possível atualizar a venda!'
            oResult.icon = 'error'
            oResult.confirmButtonText = 'Ok'
            oResult.result = false

            oVendaOld = {
                cliente: this.sOldNomeClienteOld,
                produto: this.sOldNomeProdutoOld,
                preco: this.nOldPrecoVendidoOld,
                qtd: this.nQtdSoldOld,
                modo: ''
            }            
        } else {
            oResult.title = 'Erro ao cadastrar a venda'
            oResult.text = 'Não foi possível cadastrar a venda!'
            oResult.icon = 'error'
            oResult.confirmButtonText = 'Ok'
            oResult.result = false

            oVendaOld = {
                cliente: this.sNomeClienteOld,
                produto: this.sNomeProdutoOld,
                preco: this.nPrecoVendidoOld,
                qtd: this.nQtdVendidaOld,
                modo: ''
            }
        }
        this._sweetAlert(oResult);
        return oVendaOld;
    } */

    /**
     * @param {*} oSale 
     * @param {*} oProdutoSold 
     * @returns 
     */
    /* _createSale(oSale, oProdutoSold) {
        let oResult = {
            title: '',
            text: '',
            icon: '',
            confirmButtonText: '',
            result: false
        }

        oSale.preco = oProdutoSold.preco  // Atualiza o preço do produto

        // Se a quantidade de produtos disponíveis for maior que a quantidade de produtos vendidos
        if ((oProdutoSold.qtd - oSale.qtd) > -1){
            oProdutoSold.qtd -= oSale.qtd

            oResult.title = 'Venda cadastrada com sucesso!'
            oResult.text = 'A venda foi cadastrada com sucesso!'
            oResult.icon = 'success'
            oResult.confirmButtonText = 'Ok'
            oResult.result = true
        } else if (oProdutoSold.qtd < 0){ 
            oResult.title = 'Erro ao cadastrar a venda'
            oResult.text = 'Este produto se encontra fora de estoque!'
            oResult.icon = 'error'
            oResult.confirmButtonText = 'Ok'
            oResult.result = false
        } else{
            oResult.title = 'Erro ao cadastrar a venda'
            oResult.text = `Há apenas ${oProdutoSold.qtd} unidades deste produto em estoque!`
            oResult.icon = 'error'
            oResult.confirmButtonText = 'Ok'
            oResult.result = false
        }

        this._sweetAlert(oResult);
        return oResult;
    } */

    /**
     * @param {*} saleAux
     * @param {*} nOldQtdSold
     * @returns
     */
    /*_updateSale(oSale, nOldQtdSold) {
         if (oSale.qtd != nOldQtdSold) { // Se foi alterado
            let difQtdSold = oSale.qtd - nOldQtdSold; // diferença entre a atual quantidade vendida e a anterior
            let produtoTotQtd = produtos.find({ nome: oSale.produto })[0];
            let auxProdTotQtd = produtoTotQtd.qtd;
            let auxQtdSoldOld = nOldQtdSold;

            let oResult = {
                title: '',
                text: '',
                icon: '',
                confirmButtonText: '',
                result: false
            }

            oResult.title = 'Venda atualizada com sucesso!'
            oResult.text = 'A venda foi atualizada com sucesso!'
            oResult.icon = 'success'
            oResult.confirmButtonText = 'Ok'
            oResult.result = true

            // Se aquantidade de produtos vendidos for maior que a quantidade de produtos disponíveis
            if (parseInt(auxProdTotQtd - oSale.qtd) <= 0) {
                oResult.title = 'Erro ao cadastrar a venda'
                oResult.text = `Há apenas ${auxQtdSoldOld} unidades deste produto em estoque!`
                oResult.icon = 'error'
                oResult.confirmButtonText = 'Ok'
                oResult.result = false

                oSale.qtd = nOldQtdSold;

            } else if (oSale.qtd <= 0) {// Se a quantidade de produtos vendidos for menor ou igual a 0
                oResult.title = 'Erro ao cadastrar a venda'
                oResult.text = `A quantidade de produtos vendidos não podem ser menores ou iguais a zero!`
                oResult.icon = 'error'
                oResult.confirmButtonText = 'Ok'
                oResult.result = false

                oSale.qtd = nOldQtdSold;

            } else if (oSale.qtd >= nOldQtdSold) {
                auxProdTotQtd -= difQtdSold;

            } else if (0 < oSale.qtd < nOldQtdSold) {
                auxProdTotQtd += difQtdSold * -1;
            }
            produtoTotQtd.qtd = parseInt(auxProdTotQtd); // Atualiza a quantidade de produtos disponíveis
    
            this._sweetAlert(oResult);
        }
        return oResult;
    } */
}

new Vue({
    el: 'body',
    data: {
        mode: '',
        openModal: false,
        vendas: [],
        clientes: [],
        produtos: [],
        sale: {
            cliente: '',
            produto: '',
            preco: 0,
            qtd: 1,
            modo: ''
        }
    },
    ready: function () {
        this.produtos = produtos.data;
        this.clientes = clientes.data;
        this.vendas = vendas.data;
        console.log(this.produtos)
    },
    methods: {
        editSale: function (sale) {
            this.mode = 'edicao'
            this.openModal = true
            this.sale = sale
            oldQtdAval = 

            nOldQtdSold = this.sale.qtd
            sOldNomeCliente = this.sale.cliente
            sOldNomeProduto = this.sale.produto
            nOldPrecoVendido = this.sale.preco

        },
        createSale: function () {
            this.mode = 'cadastro'
            this.openModal = true
            this.sale = {
                cliente: '',
                produto: '',
                preco: 0,
                qtd: 1,
                modo: ''
            }
        },
        saleStoreOrUpdate: function () {
            /* let oSale = this.sale
            let oProdutoSold = produtos.find({ nome: this.sale.produto })[0]
            let vendas = new Vendas(this, sOldNomeCliente, sOldNomeProduto,  nOldQtdSold, nOldPrecoVendido)
            let oResult = vendas._validaNovaVenda(oSale, oProdutoSold, this.mode)
            this.openModal = false

            if (oResult.result) {
                if (this.mode == 'cadastro') { // Cadastro
                    let rRetorno = vendas._createSale(oSale, oProdutoSold)
                    if (rRetorno.result) { 
                        vendas.insert(oSale)
                    }
                    
                } else { // Edição
                    let rRetorno = vendas._updateSale(oSale, nOldQtdSold)

                    if (rRetorno.result) {
                        vendas.update(oSale)
                    } else {
                        let oVendaOld = vendas._updateValoresAntigos(this.mode)
                        vendas.update(oVendaOld)
                    }
                }
            } else {
                let oVendaOld = vendas._updateValoresAntigos(this.mode)
                vendas.update(oVendaOld)
            }
            db.save() */
        },
        closeNotSaving(sale){
            this.sale.qtd = nOldQtdSold 
            this.openModal = false
        }
    }
})