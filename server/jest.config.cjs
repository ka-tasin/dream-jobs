/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/__tests__"],
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { 
      tsconfig: {
        module: "commonjs"
      }
    }],
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  clearMocks: true,
  verbose: true,
};
