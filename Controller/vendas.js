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
let oldQtdSold = 1

db.save() // Salva o arquivo JSON

class ControllerClass {
    constructor(model, sale, produtos) {
      this.model = model;
      this.sale  = sale;
      this.produtos = produtos;
    }

    /**
     * @private
     * @param {*} saleAux 
     * @param {*} oldQtdSold 
     * @returns 
     */
    _updateSale(saleAux, oldQtdSold) {
        if(saleAux.qtd != oldQtdSold){  // Se foi alterado
            let difQtdSold = this.sale.qtd - oldQtdSold  // Tira a diferança entre a atual quantidade vendida e a anterior
            let produtoSold = produtos.find({ nome: this.sale.produto })[0]
            let auxProdQtdSold = produtos.find({ nome: this.sale.produto })[0].qtd

            if ( (parseInt(auxProdQtdSold - saleAux.qtd)) <= 0 ) { // Se a quantidade de produtos vendidos for maior que a quantidade de produtos disponíveis
                alert(`Há somente ${produtoSold.qtd} do produto "${produtoSold.nome}" ${produtoSold.name == 1 ? 'disponível' : 'disponíveis'}!`)
                saleAux.qtd = oldQtdSold

            } else if (saleAux.qtd <= 0) { // Se a quantidade de produtos vendidos for menor ou igual a 0
                alert(`A quantidade de produtos vendidos não podem ser menores ou iguais a zero!`)
                saleAux.qtd = oldQtdSold

            } else if (saleAux.qtd >= oldQtdSold){ 
                auxProdQtdSold -= difQtdSold

            } else if ( (0 < saleAux.qtd < oldQtdSold) ){
                auxProdQtdSold += (difQtdSold * -1)
            }

            produtoSold.qtd = parseInt(auxProdQtdSold)
        }
        return saleAux
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

            oldQtdSold = this.sale.qtd
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
            if (typeof this.sale.$loki != 'undefined') {
                let sale = this.sale
                let produtoSold = produtos.find({ nome: this.sale.produto })[0]

                // Chamando o método responsável por atualizar a quantidade de produtos vendidos
                let controllerClass = new ControllerClass(this, this.sale, produtoSold);
                let rSale = controllerClass._updateSale(sale, oldQtdSold)

                vendas.update(rSale)
                this.openModal = false

            } else {
                this.sale.preco = produtos.find({ nome: this.sale.produto })[0].preco  // Procuramos nos produtos o produto com o nome selecionado na parte da venda

                if ((produtos.find({ nome: this.sale.produto })[0].qtd - this.sale.qtd) > -1){
                    produtos.find({ nome: this.sale.produto })[0].qtd -= this.sale.qtd
                    vendas.insert(this.sale)
                    this.openModal = false

                } else if (produtos.find({ nome: this.sale.produto })[0].qtd < 0){
                    alert("Este produto se encontra fora de estoque!")
                } else{
                    alert(`Há somente ${produtos.find({ nome: this.sale.produto })[0].qtd} do produto "${produtos.find({ nome: this.sale.produto })[0].nome}" ${produtos.find({ nome: this.sale.produto })[0].name == 1 ? 'disponível' : 'disponíveis'}!`)
                }
            }
            db.save()
        },
        closeNotSaving(sale){
            this.sale.qtd = oldQtdSold 
            this.openModal = false
        }
    }
})