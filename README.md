## Getting Started
Install
```bash
npm i
# or
yarn i
# or
pnpm i
# or
bun i
```
Run
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Migrations
- Create your database. Is recommended mariadb or mysql.
- In `/config/config.json` changes your database connnection.
- `npx sequelize-cli db:migrate`


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Best pratices server components
Open [http://localhost:3000/tarefa](http://localhost:3000/tarefa)

In the page pratice url parameters, note that almost everything uses url parameters to control states. Recommended by vercel use
[url search params](https://nextjs.org/learn/dashboard-app/adding-search-and-pagination#why-use-url-search-params)
