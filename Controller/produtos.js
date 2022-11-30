let read = require('read-file-utf8')
let loki = require('lokijs')  // Mesmo que "import"  
let db = new loki('Views/db.json')
let data = read(__dirname + '/db.json')

db.loadJSON(data)
window.Vue = require('vue')
// let produtos = db.addCollection('produtos')
// Alertas - Swal.js
const Swal = require('sweetalert2')

let produtos = db.getCollection('produtos')

let oldQtdAval = 1

class Produtos {
    constructor(model) {
        this.model = model;
        this.produtos = this.produtos;
    }

    _validarCadastroProduto(oProduto, modo) {
        let sProdutoNome = oProduto.nome
        let nProdutoPreco = oProduto.preco
        let nProdutoQtd = oProduto.qtd
        let mode = modo === 'cadastro' ? 'cadastrar' : 'editar'
        let oResult = {
            title: '',
            text: '',
            icon: '',
            confirmButtonText: '',
            result: false
        }

        if ((sProdutoNome == '' || sProdutoNome == null ) || (nProdutoPreco == '' || nProdutoPreco == null) ||
            (nProdutoQtd == '' || nProdutoQtd == null)) {
            oResult.title = `Erro ao ${mode} o produto`
            oResult.text = 'Todos os campos devem estar preenchidos'
            oResult.icon = 'error'
            oResult.confirmButtonText = 'Ok'
            oResult.result = false

        }  else if (this._validaNomeProd(sProdutoNome) == false) {
            oResult.title = `Erro ao ${mode} o produto`
            oResult.text = 'Nome inválido'
            oResult.icon = 'error'
            oResult.confirmButtonText = 'Ok'
            oResult.result = false

        } else if (this._validaPrecoProd(nProdutoPreco) == false) {
            oResult.title = `Erro ao ${mode} o produto`
            oResult.text = 'Preço inválido'
            oResult.icon = 'error'
            oResult.confirmButtonText = 'Ok'
            oResult.result = false

        } else if (this._validaQtdProd(nProdutoQtd) == false) {
            oResult.title = `Erro ao ${mode} o produto`
            oResult.text = 'Quantidade inválida'
            oResult.icon = 'error'
            oResult.confirmButtonText = 'Ok'
            oResult.result = false

        } else {
            oResult.title = `Produto ${mode === "cadastrar" ? "cadastrado" : "editado"} com sucesso`	
            oResult.text = 'Produto cadastrado com sucesso'
            oResult.icon = 'success'
            oResult.confirmButtonText = 'Ok'
            oResult.result = true
        }
        return oResult;
    }

    /**
     * @param {*} sProdutoNome
     * @returns 
     */
    _validaNomeProd(sProdutoNome) {
        // regex to find especial characters
        let regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

        return regex.test(sProdutoNome) != true ? true : false;
    }

    /**
     * @param {*} nProdutoPreco 
     * @returns
     */
    _validaPrecoProd(nProdutoPreco) {
        return nProdutoPreco.replace(/[^0-9.]/g, "") == nProdutoPreco ? true : false;
    }

    /**
     * @param {*} nProdutoQtd 
     * @returns 
     */
    _validaQtdProd(nProdutoQtd) {
        return nProdutoQtd.replace(/[^0-9]/g, "") == nProdutoQtd ? true : false;
    }
}

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

            sProdutoNomeOld = this.product.nome
            nProdutoPrecoOld = this.product.preco
            nProdutoQtdOld = this.product.qtd
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
            let Produto = new Produtos(this)
            let oProduto = this.product
            let oResult = Produto._validarCadastroProduto(oProduto, this.mode)

            this.openModal = false
            Swal.fire({
                title: oResult.title,
                text: oResult.text,
                icon: oResult.icon,
                confirmButtonText: oResult.confirmButtonText
            })

            if (oResult.result == true) {
                if (this.mode == 'cadastro') {
                    produtos.insert(oProduto)
                } else {
                    produtos.update(oProduto)
                }
                db.save()
            } else {
                oProduto.nome = sProdutoNomeOld
                oProduto.preco = nProdutoPrecoOld
                oProduto.qtd = nProdutoQtdOld
                produtos.update(oProduto)
                db.save()
            }
        },
        closeNotSaving(product){
            this.product.qtd = oldQtdAval
            this.openModal = false
        }
    }
})