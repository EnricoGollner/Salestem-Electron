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

db.save() // Salva o arquivo JSON

class ControllerVendas {
    constructor(model) {
        this.model = model;
        this.sale = this.sale;
        this.produtos = this.produtos;
    }

    /**
     * 
     * @param {*} oSale 
     * @param {*} oProdutoSold 
     * @returns 
     */
    _createSale(oSale, oProdutoSold) {
        oSale.preco = oProdutoSold.preco  // Atualiza o preço do produto

        // Se a quantidade de produtos disponíveis for maior que a quantidade de produtos vendidos
        if ((oProdutoSold.qtd - oSale.qtd) > -1){
            oProdutoSold.qtd -= oSale.qtd
            
            return true
        } else if (oProdutoSold.qtd < 0){ 
            alert("Este produto se encontra fora de estoque!")
            return false
        } else{
            alert(`Há somente ${oProdutoSold.qtd} do produto "${oProdutoSold.nome}"` +
                `${oProdutoSold.name == 1 ? 'disponível' : 'disponíveis'}!`)
            return false
        }
    }

    /**
     * @private
     * @param {*} saleAux
     * @param {*} nOldQtdSold
     * @returns
     */
    _updateSale(oSale, nOldQtdSold) {
        if (oSale.qtd != nOldQtdSold) { // Se foi alterado
            let difQtdSold = oSale.qtd - nOldQtdSold; // diferença entre a atual quantidade vendida e a anterior
            let produtoTotQtd = produtos.find({ nome: oSale.produto })[0];
            let auxProdTotQtd = produtoTotQtd.qtd;

            // Se aquantidade de produtos vendidos for maior que a quantidade de produtos disponíveis
            if (parseInt(auxProdTotQtd - oSale.qtd) <= 0) {
                alert(`Há somente ${produtoTotQtd.qtd} do produto "${produtoTotQtd.nome}"` + 
                    `${produtoTotQtd.name == 1 ? "disponível" : "disponíveis"}!`);
                oSale.qtd = nOldQtdSold;

            } else if (oSale.qtd <= 0) {// Se a quantidade de produtos vendidos for menor ou igual a 0
                alert(`A quantidade de produtos vendidos não podem ser menores ou iguais a zero!`);
                oSale.qtd = nOldQtdSold;

            } else if (oSale.qtd >= nOldQtdSold) {
                auxProdTotQtd -= difQtdSold;

            } else if (0 < oSale.qtd < nOldQtdSold) {
                auxProdTotQtd += difQtdSold * -1;
            }
            produtoTotQtd.qtd = parseInt(auxProdTotQtd); // Atualiza a quantidade de produtos disponíveis
        }
        return oSale;
    }
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
            let sale = this.sale
            let produtoSold = produtos.find({ nome: this.sale.produto })[0]
            let controllerClass = new ControllerVendas(this)

            if (typeof this.sale.$loki != 'undefined') {
                let rSale = controllerClass._updateSale(sale, nOldQtdSold)

                vendas.update(rSale)
                this.openModal = false

            } else {
                let rSale = controllerClass._createSale(sale, produtoSold)

                if (rSale) { 
                    vendas.insert(sale)
                    this.openModal = false 
                }
            }
            db.save()
        },
        closeNotSaving(sale){
            this.sale.qtd = nOldQtdSold 
            this.openModal = false
        }
    }
})