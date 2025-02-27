# Environment Configs

The environment config variables that can be used with the microservices are given below

## Identity provider config file

You can add a file called `'.idp.env'` in the configs folder with any of the following values to override
the default behavior.

1. **APP_HOST**: The host address where the application will try to listen. Defaults to `localhost`.
2. **APP_PORT**: The port address the app will try to listen on. Defaults to `12000`.
3. **DB_HOST**: The host address of the MySQL server. Defaults to `localhost`.
4. **DB_PORT**: The port address of the MySQL server. Defaults to `3306`.
5. **DB_USER**: The username for authenticating with the MySQL server. Defaults to `root`.
6. **DB_PASS**: The password for authenticating with the MySQL server. Defaults to `root`.
7. **DB_NAME**: The name of the database we are connecting with on the MySQL server. Defaults to `idp`.

## Cache config file

You can add a file called `'.cache.env'` in the configs folder with any of the following values to override
the default behavior.

1. **APP_HOST**: The host address where the application will try to listen. Defaults to `localhost`.
2. **APP_PORT**: The port address the app will try to listen on. Defaults to `12001`.

## Generator config file

You can add a file called `'.generator.env'` in the configs folder with any of the following values to override
the default behavior.

1. **APP_HOST**: The host address where the application will try to listen. Defaults to `localhost`.
2. **APP_PORT**: The port address the app will try to listen on. Defaults to `12002`.
3. **OPEN_AI_API_KEY**: Secret key used to access the . Defaults to `localhost`.Defaults to `idp`.

## CRUD config file

You can add a file called `'.crud.env'` in the configs folder with any of the following values to override
the default behavior.

1. **APP_HOST**: The host address where the application will try to listen. Defaults to `localhost`.
2. **APP_PORT**: The port address the app will try to listen on. Defaults to `12003`.
3. **DB_CONN_STRING**: the mongo db connection string
