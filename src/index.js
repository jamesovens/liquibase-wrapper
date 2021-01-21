#!/usr/bin/env node
const childProcess = require('child_process');
const path = require('path');

class Liquibase {

	constructor(params = {}) {
		const defaultParams = {
			liquibase: path.join(__dirname, './liquibase/liquibase-4.2.2/liquibase'),
			// changeLogFile: path.join(__dirname, '"<PATH TO YOUR MASTER CHANGELOG FILE>"'),
			// url: '"jdbc:<DB ENGINE>://<HOST>:<PORT>;database=<DATABASE>;"',
			// username: '<USERNAME>',
			// password: '<PASSWORD>',
			// classpath: path.join(__dirname, './mysql/mysql-connector-java-5.1.49.jar')
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
