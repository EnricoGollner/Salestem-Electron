// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const loki = require('lokijs')  // Mesmo que "import"
let db = new loki('Views/db.json')
let clientes = db.addCollection('Clientes')  // O mesmo que criar uma tabela de banco de dados
/* clientes.insert({
    nome: 'Enrico',
    email: 'contato@gmail.com'
}) */
db.save()

window.onload(
    document.querySelector('#salvar').addEventListener('click', (e) => {
        e.preventDefault()
        let data = {
            nome: document.querySelector('#nome').value,
            cpf: document.querySelector('#cpf').value,
            telefone: document.querySelector('#telefone').value
        }
        clientes.insert(data)
        db.save()
        alert('Salvo com sucesso')
        document.querySelector('#cadastro-clientes').reset()
    })
)
