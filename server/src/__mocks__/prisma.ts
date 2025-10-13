export default {
  job: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback()),
};
