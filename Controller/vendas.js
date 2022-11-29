let read = require('read-file-utf8')
    let loki = require('lokijs')  // Mesmo que "import"
    let db = new loki('Views/db.json')
    let data = read(__dirname + '/db.json')
    db.loadJSON(data)
    window.Vue = require('vue')
    let vendas = db.getCollection('vendas')
    let clientes = db.getCollection('Clientes')
    let produtos = db.getCollection('produtos')
    

    db.save()

    let oldQtdSold = 1
    let oldQtdAval = 1

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
                oldQtdSold = this.sale.qtd
                oldQtdAval = produtos.find({ nome: this.sale.produto })[0].qtd // Guarda a anterior para tirar a diferença
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
                oldQtdSold = this.sale.qtd
                oldQtdAval = produtos.find({ nome: this.sale.produto })[0].qtd // Guarda a anterior para tirar a diferença
            },
            saleStoreOrUpdate: function () {

                if (typeof this.sale.$loki != 'undefined') {

                    // Achar uma forma de verificar a edição do produto, diminuindo ou abaixando a quantidade disponível de acordo com o que é inserido na edição da venda

                    /*
                    let difQtdAval = produtos.find({ nome: this.sale.produto })[0].qtd - oldQtdAval

                    let difQtdSold = this.sale.qtd - oldQtdSold

                    if (produtos.find({ nome: this.sale.produto })[0].qtd > produtos.find({ nome: this.sale.produto })[0].qtd + difQtdAval){
                        Number(produtos.find({ nome: this.sale.produto })[0].qtd -= oldQtdSold)

                    } else{
                        Number(produtos.find({ nome: this.sale.produto })[0].qtd += difQtdSold)
                    }
                    */

                    vendas.update(this.sale)
                    this.openModal = false
                } else {
                     // console.log(produtos.find({nome: this.sale.produto})[0].preco)  // Procuramos nos produtos o produto com o nome selecionado na parte da venda
                     this.sale.preco = produtos.find({ nome: this.sale.produto })[0].preco  // Procuramos nos produtos o produto com o nome selecionado na parte da venda

                     if (this.sale.qtd > produtos.find({ nome: this.sale.produto })[0].qtd){

                        alert(`Há somente ${produtos.find({ nome: this.sale.produto })[0].qtd} do produto "${produtos.find({ nome: this.sale.produto })[0].nome}" ${produtos.find({ nome: this.sale.produto })[0].name == 1 ? 'disponível' : 'disponíveis'}!`)

                     } else if (produtos.find({ nome: this.sale.produto })[0].qtd > 0){
                        produtos.find({ nome: this.sale.produto })[0].qtd -= this.sale.qtd
                        vendas.insert(this.sale)
                        this.openModal = false
                    }else{
                         alert("Este produto se encontra fora de estoque!")
                     }
                 }
                 db.save()
             }
         }
     })