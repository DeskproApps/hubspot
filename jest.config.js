const esModules = [
    "d3-array",
    "d3-hierarchy",
    "internmap",
    "d3-scale",
    "pretty-bytes",
    "simplebar-react",
    "simplebar",
    "@react-dnd",
    "react-dnd",
    "dnd-core",
    "react-dnd-html5-backend",
    "react-merge-refs",
    "uuid",
    "@deskpro/deskpro-ui",
    "node-fetch",
    "data-uri-to-buffer",
    "fetch-blob",
    "formdata-polyfill",
].join("|");

module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    resolver: "<rootDir>/custom-jest-resolver",
    maxWorkers: "75%",
    modulePaths: ["<rootDir>/src/"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.tsx"],
    transform: {
        "^.+\\.(t|j)sx?$": [
            "@swc/jest",
            {
                sourceMaps: true,
            },
        ],
        "^.+\\.mjs$": "@swc/jest",
    },
    moduleNameMapper: {
        "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
            "<rootDir>/config/jest/fileTransform.js",
        "\\.(css|less)$": "<rootDir>/config/jest/fileTransform.js",
    },
    transformIgnorePatterns: [`/node_modules/.pnpm/(?!${esModules})`],
    modulePathIgnorePatterns: ["/node_modules/", ".dist"],
    collectCoverageFrom: ["<rootDir>/src/**/*.{ts,tsx}"],
    testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
    coveragePathIgnorePatterns: [
        "node_modules",
        "codegen-agent",
        "codegen-admin",
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
    ],
    globalSetup: "./config/jest/global-setup.js",
};
