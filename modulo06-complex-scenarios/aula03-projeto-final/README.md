# Projeto final - Método TAJS

## Executando

Em um terminal
```sh
cd api
npm ci --silent
npm start
```
Em outro terminal

```sh
cd app
npm ci --silent
```

Agor, você poderá escolher entre executar a aplicação  `web` or `cli`. Siga os passos abaixo para selecioná-las:

### Web
```sh
npm run web
```
Vá para [http://localhost:3001/ui](http://localhost:3001/ui)

### CLI
```sh
npm run cli
```

Para executar os testes, execute:

```sh
npm t
```

ou com live reload:

```sh
npm run test:watch
```

## Checklist Desafio

- [] - Adicionar banco de dados para API
- [] - Testes e2e para toda a UI na Web
- [] - Testes e2e para toda a UI na CLI
- [] - Testes e2e para toda a API
- [] - Testes unitários com 100% de code coverage

### Plus

- [] - Adicionar funcionalidade para cadastro de pessoa
- [] - Adicionar funcionalidade para edição de pessoa
- [] - Adicionar funcionalidade para atualização de pessoa
- [] - Adicionar funcionalidade para remoção de pessoa
- [] - Colocar testes para rodar em GitHub Actions
