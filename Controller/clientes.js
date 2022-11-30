// Definições - Loki
let read = require('read-file-utf8')
let loki = require('lokijs')  // Mesmo que "import"  
let db = new loki('Views/db.json')
let fileExists = require('file-exists')
const vue = require('vue')

// Alertas - Swal.js
const Swal = require('sweetalert2')

let data = {}
if (fileExists(__dirname + '/db.json')) {
    data = read(__dirname + '/db.json')
    db.loadJSON(data)
} else {
    db.addCollection('vendas')
    db.addCollection('Clientes')
    db.addCollection('produtos')
    db.save()
}
window.Vue = require('vue')
// Definindo o banco de dados de Clientes
let clientes = db.getCollection('Clientes')

class Clientes {
    constructor(model) {
        this.model = model;
        this.clientes = this.clientes;
    }

    /**
     * @private
     * @param {*} oCliente 
     * @returns
     */
    _validarCadastro(oCliente) {        
        let sCliente = oCliente.nome
        let nClienteTel = oCliente.telefone
        let oResult = {
            title: '',
            text: '',
            icon: '',
            confirmButtonText: '',
            result: false
        }

        if ((sCliente == '' || sCliente == null ) || (nClienteTel == '' || nClienteTel == null) ||
            (oCliente.cpf == '' || oCliente.cpf == null)) { 
            oResult.title = 'Erro ao cadastrar'
            oResult.text = 'Todos os campos devem estar preenchidos'
            oResult.icon = 'error'
            oResult.confirmButtonText = 'Ok'
            oResult.result = false

        } else if (this._validaNome(oCliente.nome) == false) {
            oResult.title = 'Erro ao cadastrar'
            oResult.text = 'Nome inválido'
            oResult.icon = 'error'
            oResult.confirmButtonText = 'Ok'
            oResult.result = false

        } else if (this._validarCpf(oCliente.cpf) == false) {
            oResult.title = 'Erro ao cadastrar'
            oResult.text = 'CPF inválido'
            oResult.icon = 'error'
            oResult.confirmButtonText = 'Ok'
            oResult.result = false

        } else if (this._validarCpfDuplicado(oCliente.cpf) == false) {
            oResult.title = 'Erro ao cadastrar'
            oResult.text = 'CPF já cadastrado'
            oResult.icon = 'error'
            oResult.confirmButtonText = 'Ok'
            oResult.result = false
            
        } else if (this._validarTelefone(oCliente.telefone) == false) {
            oResult.title = 'Erro ao cadastrar'
            oResult.text = 'Telefone inválido'
            oResult.icon = 'error'
            oResult.confirmButtonText = 'Ok'
            oResult.result = false

        } else {
            oResult.title = 'Sucesso'
            oResult.text = 'Cliente cadastrado com sucesso'
            oResult.icon = 'success'
            oResult.confirmButtonText = 'Ok'
            oResult.result = true
        }

        return oResult
    }  

    /**
     * @private
     * @param {*} sNome 
     * @returns 
     */
    _validaNome(sNome) {
        return sNome.replace(/[^a-zA-ZÀ-ú ]/g, "") == sNome ? true : false;
    }

    /**
     * @private
     * @param {*} sTelefone 
     * @returns 
    */
    _validarTelefone(sTelefone) {
        return sTelefone.replace(/[^0-9]/g, "") == sTelefone ? true : false;
    }

    /**
     * @private
     * @param {*} sCpf 
     * @returns 
     */
    _validarCpf(sCpf) {
        let soma = 0;
        let resto;
        
        if (sCpf == "00000000000") return false;

        for (var i = 1; i <= 9; i++)
            soma = soma + parseInt(sCpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;

        if (resto == 10 || resto == 11) resto = 0;
        if (resto != parseInt(sCpf.substring(9, 10))) return false;

        soma = 0;
        for (i = 1; i <= 10; i++)
            soma = soma + parseInt(sCpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;

        if (resto == 10 || resto == 11) resto = 0;
        if (resto != parseInt(sCpf.substring(10, 11))) return false;
        return true;
    }

    /**
     * @private
     * @param {*} sCpf 
     * @returns 
     */
    _validarCpfDuplicado(sCpf) {
        let sClienteCpf = clientes.find({ cpf: sCpf })

        if (sClienteCpf.length <= 0) {
            return true
        } else if (sClienteCpf[0].cpf === sCpf){
            return false
        }
        
    }
}

new Vue({
    el: 'body',
    data: {
        clientes: [],
        mode: '',
        client: {
            nome: '',
            cpf: '',
            telefone: ''
        },
        openModal: false  // Começa fechado
    },
    ready: function () {
        this.clientes = clientes.data;
        console.log(this.clientes)
    },
    methods: {
        editClient: function (client) {
            this.mode = 'edicao'
            this.openModal = true
            this.client = client
        },
        createClient: function () {
            this.mode = 'cadastro'
            this.openModal = true
            this.client = { // Reinicializando os dados por precaução
                nome: '',
                cpf: '',
                telefone: ''
            }
        },
        clientStoreOrUpdate: function () {
            let clienteClass = new Clientes(this)

            let oResult = clienteClass._validarCadastro(this.client)
            this.openModal = false

            Swal.fire({
                title: oResult.title,
                text: oResult.text,
                icon: oResult.icon,
                confirmButtonText: oResult.confirmButtonText
            })

            if (oResult.result) {
                if (this.mode == 'cadastro') {
                    clientes.insert(this.client)
                } else {
                    clientes.update(this.client)
                }
            }
        }
    }
})