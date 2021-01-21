#!/usr/bin/env node
const childProcess = require('child_process');
const path = require('path');

class Liquibase {

	constructor(params = {}) {
		if (!params.username) {
			console.error("liquibase-wrapper - 'username' is missing. Liquibase wrapper requires the name of the user with correct access right to the database, e.g. username: 'root'");
			process.exit(1);
		}

		if (!params.password) {
			console.warn("liquibase-wrapper - 'password' is missing. Liquibase will attempt to connect to the database without using a password.");
		}

		if (!params.classpath) {
			console.error("liquibase-wrapper - 'classpath' is missing. Liquibase wrapper requires the path to the JDBC driver, e.g. classpath: './mysql/mysql-connector-java-5.1.49.jar'");
			process.exit(1);
		}

		params.classpath = path.join(__dirname, params.classpath)

		const defaultParams = {
			liquibase: path.join(__dirname, './liquibase/liquibase-4.2.2/liquibase'),
		};

		this.params = Object.assign({}, defaultParams, params);
	}

	run(action = 'update', params = '') {
		return this._exec(`${this._command} ${action} ${params}`);
	}

	get _command() {
		let cmd = `${this.params.liquibase}`;
		Object.keys(this.params).forEach(key => {
			if (key === 'liquibase') {
				return;
			}
			const value = this.params[key];
			cmd = `${cmd} --${key}=${value}`;
		});
		return cmd;
	}

	_exec(command, options = {}) {
		console.warn(command);
		let child;
		let promise = new Promise((resolve, reject) => {
			child = childProcess
				.exec(command, options, (error, stdout, stderr) => {
					console.log('\n', stdout);
					console.error('\n', stderr);
					if (error) {
						error.stderr = stderr;
						return reject(error);
					}
					resolve({ stdout: stdout });
				});
		});
		promise.child = child;
		return promise;
	}
}

function LiquibaseGenerator(params) {
	return new Liquibase(params);
}

module.exports = LiquibaseGenerator;
