/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	transform: {
		'\\.tsx?$': ['ts-jest',{
			useESM: false,
			isolatedModules: true,
			//tsconfig: '<rootDir>/tsconfig.test.json',
		}],
	},
	modulePathIgnorePatterns: ["<rootDir>/dist/"],
	transformIgnorePatterns: ['<rootDir>/.yarn/cache'],
	testEnvironment: 'node',
	extensionsToTreatAsEsm: ['.ts'],
}

// https://github.com/kulshekhar/ts-jest/issues/2629#issuecomment-1123909905