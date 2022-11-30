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

                    if(this.sale.qtd != oldQtdSold){  // Se foi alterado
                        let difQtdSold = this.sale.qtd - oldQtdSold  // Tira a diferança entre a atual quantidade vendida e a anterior

                        if((produtos.find({ nome: this.sale.produto })[0].qtd + difQtdSold) < 0){
                            alert(`Há somente ${produtos.find({ nome: this.sale.produto })[0].qtd} do produto "${produtos.find({ nome: this.sale.produto })[0].nome}" ${produtos.find({ nome: this.sale.produto })[0].name == 1 ? 'disponível' : 'disponíveis'}!`)
                        } else if((produtos.find({ nome: this.sale.produto })[0].qtd + difQtdSold) > produtos.find({ nome: this.sale.produto })[0].qtd){
                            produtos.find({ nome: this.sale.produto })[0].qtd -= difQtdSold
                        } else{
                            produtos.find({ nome: this.sale.produto })[0].qtd += difQtdSold
                        }
                    }

                    vendas.update(this.sale)
                    this.openModal = false
                } else {
                    // console.log(produtos.find({nome: this.sale.produto})[0].preco)  // Procuramos nos produtos o produto com o nome selecionado na parte da venda
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