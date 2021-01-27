module.exports = {
    collectCoverage: true,
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/examples/'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    collectCoverageFrom: ['./src/**/*.{js, ts}'],
    globals: {
        __DEV__: true,
    },
    timers: 'fake',
};
