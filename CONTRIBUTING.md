# Contributing to Loki-Dhaka CRM

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the Loki-Dhaka project.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and professional in all interactions.

## Getting Started

### Prerequisites
- Node.js v18.0.0 or higher
- npm v9.0.0 or higher
- Git
- PostgreSQL 12+ or MongoDB 4.4+

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/rozasanyal13-hash/Loki-Dhaka.git
cd Loki-Dhaka

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Update .env.local with your local settings
# nano .env.local

# Set up database
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

## Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b fix/bug-description
```

### 2. Make Your Changes
- Follow the coding standards below
- Write tests for new functionality
- Keep commits atomic and well-documented

### 3. Write Tests
```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Check coverage
npm run test:coverage
```

### 4. Code Quality Checks
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check (if using TypeScript)
npm run typecheck
```

### 5. Commit Your Changes
```bash
# Use conventional commits format
git commit -m "feat(customers): add customer search functionality"
git commit -m "fix(auth): resolve JWT token expiration issue"
git commit -m "test(leads): add unit tests for lead pipeline"
```

### 6. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then open a PR on GitHub using the PR template.

## Coding Standards

### JavaScript/Node.js
- Use ES6+ features
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep functions small and focused

### Example:
```javascript
/**
 * Fetches customer by ID with related contacts
 * @param {string} customerId - The customer ID
 * @returns {Promise<Object>} Customer object with contacts
 * @throws {Error} If customer not found
 */
async function getCustomerWithContacts(customerId) {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new Error('Customer not found');
  customer.contacts = await Contact.find({ customerId });
  return customer;
}
```

### SQL Queries
- Use parameterized queries (prevent SQL injection)
- Add indexes for frequently queried fields
- Comment complex queries

```javascript
// ✅ Good: Parameterized query
await db.query(
  'SELECT * FROM customers WHERE email = $1 AND status = $2',
  [email, 'active']
);

// ❌ Bad: String concatenation (SQL injection risk)
await db.query(`SELECT * FROM customers WHERE email = '${email}'`);
```

### API Endpoints
- Use RESTful conventions
- Return consistent response format
- Include proper HTTP status codes
- Document with JSDoc

### Testing Standards
- Write unit tests for business logic
- Write integration tests for API endpoints
- Aim for >80% code coverage
- Use descriptive test names

```javascript
describe('Customer Service', () => {
  describe('createCustomer', () => {
    it('should create a new customer with valid data', async () => {
      const result = await createCustomer(validCustomerData);
      expect(result).toHaveProperty('id');
      expect(result.email).toBe(validCustomerData.email);
    });

    it('should throw error for duplicate email', async () => {
      await createCustomer(validCustomerData);
      await expect(createCustomer(validCustomerData))
        .rejects.toThrow('Email already exists');
    });
  });
});
```

## Git Commit Message Format

Use Conventional Commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (no functional change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `ci`: CI/CD configuration changes
- `chore`: Build, dependency, or tooling changes

### Examples:
```
feat(customers): add advanced search filters
fix(auth): resolve JWT token validation bug
test(leads): add tests for pipeline stage transitions
docs(api): update API endpoint documentation
```

## Testing Requirements

Before submitting a PR:

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test API endpoints and workflows
3. **Manual Testing**: Test in the browser/application
4. **Edge Cases**: Test with boundary conditions
5. **Security**: Test for common vulnerabilities

```bash
# Run all tests
npm run test:all

# Generate coverage report
npm run test:coverage
```

## Documentation

- Update README.md if adding new features
- Add JSDoc comments to functions
- Update API documentation in docs/API.md
- Update CHANGELOG.md

## Performance Guidelines

- Optimize database queries (use indexes, avoid N+1)
- Implement pagination for large datasets
- Use caching strategically
- Monitor and profile performance

## Security Guidelines

- Never commit secrets or API keys
- Use parameterized queries to prevent SQL injection
- Validate and sanitize all inputs
- Implement CSRF protection
- Use HTTPS in production
- Keep dependencies up to date

## Review Process

1. Code review by at least one maintainer
2. All tests must pass
3. Code coverage should not decrease
4. Documentation must be updated
5. No merge conflicts

## Questions or Need Help?

- Check existing issues and discussions
- Review documentation in `/docs`
- Ask in GitHub Discussions
- Contact maintainers

Thank you for contributing to Loki-Dhaka!
