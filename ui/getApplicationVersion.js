const fs = require('fs');
const util = require('util');
const child = require('child_process');
const exec = util.promisify(child.exec);

async function createVersionsFile(filename) {
	const commitHash = (await exec('git rev-parse --short HEAD')).stdout
		.toString()
		.trim();

	console.log(`version: '${commitHash}'`);

	fs.writeFileSync(filename, JSON.stringify({ version: commitHash }), {
		encoding: 'utf8',
	});
}

createVersionsFile('src/application-version.json');
