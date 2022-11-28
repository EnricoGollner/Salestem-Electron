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
                modo: 'Credito'
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
                    vendas.update(this.sale)
                } else {
                    // console.log(produtos.find({nome: this.sale.produto})[0].preco)  // Procuramos nos produtos o produto com o nome selecionado na parte da venda
                    this.sale.preco = produtos.find({ nome: this.sale.produto })[0].preco  // Procuramos nos produtos o produto com o nome selecionado na parte da venda 
                    vendas.insert(this.sale)
                }
                db.save()
                this.openModal = false
            }
        }
    })