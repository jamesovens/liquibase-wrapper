## What does it do?
This package takes the standard Liquibase JAR and a series of JDBC drivers for popular DB engines and wraps so that they can be interacted with from within a node.js project.

### Example Usage
```
await liquibase(liquibaseConfig).run("update");
```
The above is the equivalent of calling the update command on the Liquibase JAR itself.

## Install

NPM:
```
$ npm install --save liquibase-wrapper
```
Yarn:
```
$ yarn add liquibase-wrapper
```

## Usage
You can import the package like so:
```
import liquibase from "liquibase-wrapper";
```
Or
```
const liquibase = require("liquibase-wrapper");
```

Then you need to pass the config object into the constructor and then run a command on it:
```
const liquibaseConfig = {
    changeLogFile: "database/changelog.yaml",
    url: `jdbc:mysql://${config.database.host}:3306/${config.database.schema}`,
    username: config.database.username,
    password: config.database.password,
    classpath: "mysql/mysql-connector-java-5.1.49.jar"
  };

await liquibase(liquibaseConfig).run("update");
```

The run function returns a promise, you can use it like so:
```
liquibase(liquibaseConfig)
    .run("update")
    .then(() => console.log('success'))
    .catch((err) => {
        console.log("Failed to run Liquibase update: ", e);
    });
```
or like:
```
try {
    await liquibase(liquibaseConfig).run("update");
} catch (e) {
    console.log("Failed to run Liquibase update: ", e);
}
```

## Liquibase Commands
You can pass in the run function any command you like and it will be passed to the Liquibase JAR which means this package is as flexible as the Liquibase standard tool.
Liquibase command documentation can be found here: https://docs.liquibase.com/commands/home.html

## Config
There is some config that you have to pass to the package in order for Liquibase to know how to connect to your database.

### changeLogFile
This is the path from the root of your project to your master changelog file.

### url
This is the url that Liquibase will use to connect to the database. This is usually of the format:
`jdbc:<YOUR DB PROVIDER>://<DB HOST>:<DB PORT>/<DB NAME>`

### username
This is the name of the user in your database that has the correct access rights in order to be able to make all the changes Liquibase can make.

### password
This is an _optional_ config item, but it is strongly recommended to use Liquibase with a user that has a username and a strong password. If you omit this parameter then Liquibase will attempt to connect to your database without a password.

### classpath
This is the path inside the liquibase-wrapper package to the driver you require for your database. The liquibase-wrapper package comes pre-packaged with a set of common JDBC drivers for different versions of common database engines.
The options that you can specify are listed below:

#### Microsoft SQL Server
* `mssql/mssql-jdbc-6.4.0.jre7.jar`
* `mssql/mssql-jdbc-6.4.0.jre9.jar`
* `mssql/mssql-jdbc-7.0.0.jre10.jar`
* `mssql/mssql-jdbc-7.4.1.jre12.jar`
* `mssql/mssql-jdbc-8.2.2.jre13.jar`
* `mssql/mssql-jdbc-8.4.1.jre8.jar`
* `mssql/mssql-jdbc-8.4.1.jre11.jar`
* `mssql/mssql-jdbc-8.4.1.jre14.jar`

#### MySQL
* `mysql/mysql-connector-java-5.1.49.jar`
* `mysql/mysql-connector-java-8.0.23.jar`

#### Oracle
* `oracle/ojdbc10.jar`
* `oracle/ojdbc11.jar`

#### Oracle
* `postgres/postgresql-42.2.18.jar`
* `postgres/postgresql-42.2.18.jre6.jar`
* `postgres/postgresql-42.2.18.jre7.jar`

### Example
So for example if you were working with a Postgres database your config might look like this:
```
const liquibaseConfig = {
    changeLogFile: "database/changelog.xml",
    url: "jdbc:postgresql://localhost:3306/my_awesome_db",
    username: "root",
    password: "Password1",
    classpath: "postgres/postgresql-42.2.18.jar"
  };

await liquibase(liquibaseConfig).run("update");
```

## Future Improvements
The most difficult aspect of this library is allowing any database engine (any JDBC driver JAR) to be used whilst not requiring the user of the package to have to add that JAR file themselves either to their repository or to their environment (e.g. inside a running container).
That is why I have taken a handful of the most popular database providers, and then taken a handful of version of JDBC JARs for each provider in order to cover most people's use cases.

The problem with this is:
* It bloats the package having so many JARs, most of which will not be used by the user as the user likely connects to one database at a time for most applications.
* If you use a vendor that I have not included, or need a JDBC version for that vendor I have not included you have no way to fix this (other than requesting a change to this library).

Ideally a better solution would allow this package to be installed where it only contains the one JDBC JAR file you require for your database, but I'm unsure how to do that currently.