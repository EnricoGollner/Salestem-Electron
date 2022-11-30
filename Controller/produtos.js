let read = require('read-file-utf8')
let loki = require('lokijs')  // Mesmo que "import"  
let db = new loki('Views/db.json')
let data = read(__dirname + '/db.json')

db.loadJSON(data)
window.Vue = require('vue')
// let produtos = db.addCollection('produtos')

let produtos = db.getCollection('produtos')

let oldQtdAval = 1

db.save()
new Vue({
    el: 'body',
    data: {
        mode: '',
        openModal: false,
        produtos: [],
        product: {
            nome: '',
            preco: '',
            qtd: 0
        }
    },
    ready: function () {
        this.produtos = produtos.data;
        console.log(this.produtos)
    },
    methods: {
        editProduct: function (product) {
            this.mode = 'edicao'
            this.openModal = true
            this.product = product


            oldQtdAval = this.product.qtd
        },
        createProduct: function () {
            this.mode = 'cadastro'
            this.openModal = true
            this.product = { // Reinicializando os dados por precaução
                nome: '',
                preco: '',
                qtd: ''
            }
        },
        productStoreOrUpdate: function () {
            if (typeof this.product.$loki != 'undefined') {
                produtos.update(this.product)
            } else {
                produtos.insert(this.product)
            }
            db.save()
            this.openModal = false
        },
        closeNotSaving(product){
            this.product.qtd = oldQtdAval
            this.openModal = false
        }
    }
})