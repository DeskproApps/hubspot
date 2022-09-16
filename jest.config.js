/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

const esModules = ["d3-array", "d3-hierarchy", "internmap", "d3-scale", "pretty-bytes"].join("|");

module.exports = {
    clearMocks: true,
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testEnvironment: "jsdom",
    transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
    modulePathIgnorePatterns: ["/node_modules/", ".dist"],
    maxWorkers: "75%",
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "ts-jest",
    },
    moduleNameMapper: {
        "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
            "<rootDir>/jest/fileTransform.js",
        "\\.(css|less)$": "<rootDir>/jest/fileTransform.js",
    },
    collectCoverageFrom: ["<rootDir>/src/**/*.{ts,tsx}"],
    coveragePathIgnorePatterns: [
        "node_modules",
        ".gen.ts",
        "testing",
        "__tests__",
        "__mocks__",
        ".test.ts",
        ".test.tsx",
        ".stories.tsx",
        ".dist",
        ".d.ts",
        "mocks",
        ".app-story.tsx",
        "main.tsx",
    ],
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 60,
            lines: 60,
        },
    },
};
