let read = require('read-file-utf8')
let loki = require('lokijs')  // Mesmo que "import"  
let db = new loki('Views/db.json')
let fileExists = require('file-exists')
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

// Validador
function validadorCpf(strCPF){
    var Soma;
    var Resto;
    Soma = 0;
  if (strCPF == "00000000000") return false;

  for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

  Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
}


let clientes = db.getCollection('Clientes')
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
            if (typeof this.client.$loki != 'undefined') {
                clientes.update(this.client)
            } else {
                clientes.insert(this.client)
            }
            db.save()
            this.openModal = false
        }
    }
})