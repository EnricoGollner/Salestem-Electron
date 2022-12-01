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
let sOldNomeCliente = ''
let sOldNomeProduto = ''

const Swal = require('sweetalert2')

db.save() // Salva o arquivo JSON

class Vendas {
    constructor(model, nOldQtdSold, sOldNomeCliente, sOldNomeProduto) {
        this.model = model;
        this.nOldQtdSold = nOldQtdSold;
        this.sOldNomeCliente = sOldNomeCliente;
        this.sOldNomeProduto = sOldNomeProduto;
    }

    /**
     * @private
     * @param {Object} oSale 
     */
    _setCreateSale(oSale) {
        vendas.insert(oSale)
    }

    /**
     * @private
     * @param {Object} oSale 
     */
    _setUpdateSale(oSale) {
        vendas.update(oSale)
    }

    /**
     * @private
     * @param {Object} oSale 
     * @returns @type {Object}
     */
    _defineValoresAntigos(oSale) {
        oSale.qtd = this.nOldQtdSold
        oSale.cliente = this.sOldNomeCliente
        oSale.produto = this.sOldNomeProduto
        return oSale
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
     * @param {Object} oSale 
     * @returns  @type {Object}
     */
    validaNovaVenda(oSale) {
        let oResult = {
            title: '',
            text: '',
            icon: '',
            confirmButtonText: '',
            result: true
        }

        if (oSale.cliente == '' || oSale.produto == '' || oSale.qtd == '' || oSale.modo == '') {
            oResult.title = 'Erro'
            oResult.text = 'Porfavor preencha todos os campos'
            oResult.icon = 'error'
            oResult.confirmButtonText = 'Ok'
            oResult.result = false   

        } else if (oSale.qtd <= 0) {
            oResult.title = 'Erro ao editar a venda'
            oResult.text = `A quantidade de produtos vendidos não podem ser menores ou iguais a zero!`
            oResult.icon = 'error'
            oResult.confirmButtonText = 'Ok'
            oResult.result = false
        }

        return oResult        
    }


 

    /**
     * @public
     * @param {Object} oSale 
     * @param {Object} oProdutoSold 
     * @returns 
     */
    validaCreateSale(oSale, oProdutoSold) {
        let oResult = {}
        oSale.preco = oProdutoSold.preco  // Atualiza o preço do produto

        // Se a quantidade de produtos disponíveis for maior que a quantidade de produtos vendidos
        if ((oProdutoSold.qtd - oSale.qtd) > -1){
            oProdutoSold.qtd -= oSale.qtd

            oResult.title = 'Venda Cadastrada'
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

        } else if (oProdutoSold.qtd < oSale.qtd) {
            oResult.title = 'Erro ao cadastrar a venda'
            oResult.text = `Há apenas ${oProdutoSold.qtd} unidades deste produto em estoque!`
            oResult.icon = 'error'
            oResult.confirmButtonText = 'Ok'
            oResult.result = false

        } else {
            oResult.title = 'Venda Cadastrada'
            oResult.text = 'A venda foi cadastrada com sucesso!'
            oResult.icon = 'success'
            oResult.confirmButtonText = 'Ok'
            oResult.result = true
        }
        this.sweetAlert(oResult);

        if (oResult.result) {
            this._setCreateSale(oSale)
        }
    }

    /**
     * @public
     * @param {Object} oSale
     * @param {Object} oProdutoSold
     * @param {Number} nOldQtdSold
     * @returns
     */
    validaUpdateSale(oSale, oProdutoSold ,nOldQtdSold) {
        let oResult = {
            title: 'Venda Editada',
            text: 'A venda foi editada com sucesso!',
            icon: 'success',
            confirmButtonText: 'Ok',
            result: true
        }

        if (oSale.qtd != nOldQtdSold) { // Se foi alterado
            let difQtdSold = oSale.qtd - nOldQtdSold; // diferença entre a atual quantidade vendida e a anterior
            let auxProdTotQtd = oProdutoSold.qtd;
            let auxQtdSoldOld = nOldQtdSold;

            // Se aquantidade de produtos vendidos for maior que a quantidade de produtos disponíveis
            if (parseInt(auxQtdSoldOld - oSale.qtd) <= 0) {
                oResult.title = 'Erro ao editar a venda'
                oResult.text = `Há apenas ${auxProdTotQtd} unidades deste produto em estoque!`
                oResult.icon = 'error'
                oResult.confirmButtonText = 'Ok'
                oResult.result = false

                oSale.qtd = nOldQtdSold;
                oSale = this._defineValoresAntigos(oSale)

            } else if (oSale.qtd <= 0) {// Se a quantidade de produtos vendidos for menor ou igual a 0
                oResult.title = 'Erro ao editar a venda'
                oResult.text = `A quantidade de produtos vendidos não podem ser menores ou iguais a zero!`
                oResult.icon = 'error'
                oResult.confirmButtonText = 'Ok'
                oResult.result = false

                oSale.qtd = nOldQtdSold;
                oSale = this._defineValoresAntigos(oSale)

            } else if (oSale.qtd >= nOldQtdSold) {
                auxProdTotQtd -= difQtdSold;

            } else if (0 < oSale.qtd < nOldQtdSold) {
                auxProdTotQtd += difQtdSold * -1;
            }
            oProdutoSold.qtd = parseInt(auxProdTotQtd); // Atualiza a quantidade de produtos disponíveis
    
            this.sweetAlert(oResult);
        }
        
        if (oResult.result) {
            this._setUpdateSale(oSale)
        }
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

            nOldQtdSold = this.sale.qtd;
            sOldNomeCliente = this.sale.cliente;
            sOldNomeProduto = this.sale.produto;
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
            let oSale = this.sale
            let oProdutoSold = produtos.find({ nome: this.sale.produto })[0]
            let vendasClass = new Vendas(this, nOldQtdSold, sOldNomeCliente, sOldNomeProduto)
            let oResult = vendasClass.validaNovaVenda(oSale, oProdutoSold, this.mode)
            this.openModal = false
            
            if (oResult.result) {
                if (this.mode === 'cadastro') {
                    vendasClass.validaCreateSale(oSale, oProdutoSold) 
                } else {
                    vendasClass.validaUpdateSale(oSale, oProdutoSold, nOldQtdSold)
                }
            } else {
                sweetAlert(oResult)
            }
            db.save()
        },
        closeNotSaving(sale){
            this.sale.qtd = nOldQtdSold 
            this.openModal = false
        }
    }
})