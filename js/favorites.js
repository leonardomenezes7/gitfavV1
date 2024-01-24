import { GithubUser } from "./githubuser.js"

// classe que vai conter a lógica dos dados
export class Favorites {
  constructor(root) {  
    this.root = document.querySelector(root)
    this.load() // chamando funçao que carrega os dados das entries
  }

  load() { // funçao que carrega os dados das entries
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username)
      if(userExists) {
        throw new Error('Usuário já cadastrado.')
      }
     
      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

  delete(user) { //funçao responsavel por deletar um user das entries porem ela substitui o array inteiro por um novo usando imutabilidade
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

//classe que vai criar a visualizacao e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root) //ligaçao com a classe Favorites e parametro chamado root para pegar a div#app no main.js

    this.tbody = this.root.querySelector('table tbody') // selecionando o HTML da table usando a ligaçao super

    this.update() // chamando funçao responsavel por atualizar a visualização do HTML da pagina
    this.onAdd()
  }

  onAdd() {
    const addButton = this.root.querySelector('.search button')

    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }
  }

  update() { // funçao responsavel por atualizar a visualização do HTML da pagina
    this.removeAllTr() // função responsavel por remover todas tr da página

    this.entries.forEach((user) => { // função responsável para pegar cada um dos dados das entries (user)
      const row = this.createRow() // chamando funçao responsavel por criar as linhas de tr no HTML 

      // selecionando os dados a serem exibidos na tr puxando do array entries e salvando na variavel row
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => { // selecionado o botão remove e adicionando um evento para ele
        const isOk = confirm(`Tem certeza que deseja remover ${user.login} do GitHub Favorites`)

        if(isOk) {
          this.delete(user) // chamando funçao responsável por deletar um usuário das entries
        }
      }

      this.tbody.append(row) // funcionalidade append que adiciona dados em um array
    })
  }

  createRow() { // funçao responsavel por criar o HTML das tr para depois serem retornadas para a funçao update
    const tr = document.createElement('tr')

    tr.innerHTML = ` 
        <td class="user">
            <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
            <a href="https://github.com/maykbrito" target="_blank">
                <p>Mayk Brito</p>
                <span>maykbrito</span>
            </a>
        </td>

        <td class="repositories">
            76
        </td>

        <td class="followers">
            9589
        </td>

        <td>
            <button class="remove">&times;</button>
        </td>
                `

    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr')
    .forEach((tr) => {
      tr.remove()
    })
  }
}