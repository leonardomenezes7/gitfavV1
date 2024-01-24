export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}` // endereco da API que contem os dados

    return fetch(endpoint) // promessa de ir buscar os dados da API
    .then(data => data.json()) // entao transformando os dados em json
    .then(( {login, name, public_repos, followers} ) => ({ // entao desestruturando dados e retornando eles em um objeto
      login,
      name,
      public_repos,
      followers
    }))
  }
}