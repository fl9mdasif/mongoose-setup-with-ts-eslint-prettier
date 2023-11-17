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
9. [es-lint & prettier setup](#es-lint-setup)
10. [prettier-setup](#prettier-setup)

### es lint setup

[es-lint & prettier setup blog](https://blog.logrocket.com/linting-typescript-eslint-prettier)

- es lint setup

1. install this

```bash
npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
```

2.

```bash
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

3. you can prevent linting by creating a `.eslintignore` file and adding the folders or files you want to ignore: this file

```
node_modules
dist
```

4. then add some script to `package.json`

```json
"lint": "eslint src --ignore-path .eslintignore --ext .ts",
"lint-fix":"npx eslint src --fix"
```

then check the script `npm run lint & npm run lint-fix`

### Prettier setup

1. install prettier

```bash
npm install --save-dev prettier
```

2.  you will need to create a file called `.prettierrc.json` in the project’s root directory, then paste some code to it
    ```json
    {
      "semi": true,
      "singleQuote": true
    }
    ```
3.  add some script to `package.json`

```json
    "prettier": "prettier --ignore-path .gitignore --write \"./src/**/*.+(js|ts|json)\"",
    "prettier-fix": "npx prettier --write src",
```

- then check the script `npm run prettier & npm run prettier-fix`

4. add some script to vs code `setting.json`

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

5. The best solution here is to use the eslint-config-prettier plugin to disable all ESLint rules that are irrelevant to code formatting, as Prettier is already good at it:

```bash
npm install --save-dev eslint-config-prettier
```

6. With that installed, let’s go to the `.eslintrc` file, and add prettier at the end of your extends list to disable any other previous rules from other plugins:

```json
"extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],

```
