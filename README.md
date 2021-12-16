Notas
![app](https://user-images.githubusercontent.com/41271075/146419210-ff6b6512-24b7-4264-9256-fd9167826158.gif)

> Uma aplicação simples de "post-it" feito com NextJS (<img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" width="20"/> React) 

Esse projeto foi iniciado com [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

* Você tem o [Node.js](https://nodejs.org/pt-br/download/current/) instalado e npm

## Como rodar localmente

Rodando a API:

Dentro da pasta server crie um arquivo `.env`
e preencha com as variaveis de ambiente
```
DATABASE_URL="Uma URL de banco de dados SQL"
JWT_SECRET=Um segredo forte JWT
PASSWORD_SALT=um salt forte usado para hashear a senha
```
Agora verifique se seu terminal está na pasta `server` e execute os seguintes comandos
```bash
npm i
npm run dev
# ou
yarn dev
```
Rodando o client:

Configure a variavel de ambiente `NEXT_PUBLIC_API_URL` para ser a URL da API (backend)

```bash
npm i
npm run dev
# ou 
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.
O backend roda por padrão em [http://localhost:4000](http://localhost:4000)

*Imagem de background tirada de [Pixabay](https://pixabay.com/pt/vectors/montanhas-panorama-floresta-1412683/)*
