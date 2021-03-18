import { pathsToModuleNameMapper } from "ts-jest/utils";

import { compilerOptions } from "./tsconfig.json";

export default {
	clearMocks: true,
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: "<rootDir>",
	}),
	preset: "ts-jest",
	resolver: "jest-ts-webcompat-resolver",
	testEnvironment: "node",
};
