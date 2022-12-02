let read = require('read-file-utf8')
let loki = require('lokijs')  // Mesmo que "import"  
let db = new loki('Views/db.json')
let data = read(__dirname + '/db.json')

db.loadJSON(data)
window.Vue = require('vue')

// Alertas - Swal.js
const Swal = require('sweetalert2')

/**
 * @private
 * @param {Object} oPreco 
 */
const _mascaraPreco = (oPreco) => {
    var sPrecoValue = oPreco.value;

    sPrecoValue = sPrecoValue + '';
    sPrecoValue = parseInt(sPrecoValue.replace(/[\D]+/g, ''));
    sPrecoValue = sPrecoValue + '';
    sPrecoValue = sPrecoValue.replace(/([0-9]{2})$/g, ",$1");

    if (sPrecoValue.length > 6) {
        sPrecoValue = sPrecoValue.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    }

    oPreco.value = `R$ ${sPrecoValue}`;
    if(sPrecoValue == 'NaN') oPreco.value = '';
}

let produtos = db.getCollection('produtos')

let oldQtdAval = 1,
    sProdutoNomeOld = '',
    nProdutoPrecoOld = '',
    nProdutoQtdOld = '';

class Produtos {
    constructor(model) {
        this.model = model;
        this.produtos = this.produtos;
    }

    /**
     * @private
     * @param {Strings} sProdutoNome
     * @returns 
     */
    _validaNomeProd(sProdutoNome) {
        // regex to find especial characters
        let regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

        return regex.test(sProdutoNome) != true ? true : false;
    }

    _formataPreco(nProdutoPreco) {
        // remove o R$ e a vírgula // substitui a vírgula por ponto
        return nProdutoPreco.replace(/[^0-9,]/g, "").replace(/,/g, ".");
    }

    /**
     * @private
     * @param {Number} nProdutoPreco 
     * @returns
     */
    _validaPrecoProd(nProdutoPreco) {
        let nProdutoPrecoNew = this._formataPreco(nProdutoPreco);

        return nProdutoPrecoNew.replace(/[^0-9.]/g, "") == nProdutoPrecoNew ? true : false;
    }

    /**
     * @private
     * @param {Number} nProdutoQtd 
     * @returns 
     */
    _validaQtdProd(nProdutoQtd) {
        return nProdutoQtd.replace(/[^0-9]/g, "") == nProdutoQtd ? true : false;
    }

    /**
     * @public
     * @param {Object} oResult 
     */
    sweetAlert(oResult){
        Swal.fire({
            title: oResult.title,
            text: oResult.text,
            icon: oResult.icon,
            confirmButtonText: oResult.confirmButtonText
        })
    }
    
    /**
     * @public
     * @param {Object} oProduto 
     * @param {String} modo 
     * @returns 
    */
    validaCadastroProduto(oProduto, modo) {
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

            oProduto.preco = this._formataPreco(nProdutoPreco)
        }

        let oRetorno = {
            oSwal: oResult,
            produto: oProduto
        }

        return oRetorno;
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
            let produtoClass = new Produtos(this)
            let oProduto = this.product
            let oRetorno = produtoClass.validaCadastroProduto(oProduto, this.mode)

            this.openModal = false
            produtoClass.sweetAlert(oRetorno.oSwal)

            if (oRetorno.oSwal.result) {
                if (this.mode == 'cadastro') {
                    produtos.insert(oRetorno.produto)
                } else {
                    produtos.update(oRetorno.produto)
                }
                db.save()
            } else {

                if(this.mode == 'edicao'){
                    oProduto.nome = sProdutoNomeOld
                    oProduto.preco = produtoClass._formataPreco(nProdutoPrecoOld)
                    oProduto.qtd = nProdutoQtdOld
                    produtos.update(oProduto)
                    db.save()
                }
            }
        },
        closeNotSaving(product){
            this.product.qtd = oldQtdAval
            this.openModal = false
        }
    }
})