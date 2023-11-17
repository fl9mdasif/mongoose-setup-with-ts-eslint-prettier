# Mongoose

### Mongoose is a powerful data modeling library for MongoDB

## Why Mongoose

- Schema definition
- Model Creation
- Data Validation
- Querying
- MiddleWare Support
- Population (populate)

### setup the project

1. npm init -y
2. npm install express
3. npm install mongoose --save
4. npm install typescript --save-dev
5. npm install cors
6. npm install dotenv
   - dotenv config in 'src/app/index.ts'
7. tsc --init

   - change package.json "build":"tsc"
   - config tsc (rootDir:"src" & outDir:"dist")
   - tsc
   - node dist/app.js

8. setup app.ts & server.ts
9. [es-lint & prettier setup blog](#es-lint-setup)
10. [prettier-setup](#prettier-setup)

### es lint setup

[es-lint & prettier setup blog](https://blog.logrocket.com/linting-typescript-eslint-prettier)

- es lint setup

1. install this

```npm
npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
```

2.

```npm
npx eslint --init

```

- ans some of the following questions
- add some rules in `eslint.json`

```json
"rules": {
    "no-unused-vars": "error",
    "no-unused-expressions": "error",
    "prefer-const":"error",
    "no-undef":"error",
    "no-console": "warn"
},
"globals": {
    "process":"readonly"
}
```

3. then add some script to `package.json`

```json
"lint": "eslint src --ignore-path .eslintignore --ext .ts",
"lint-fix":"npx eslint src --fix"
```

### Prettier setup

some rules in `eslint.json`
