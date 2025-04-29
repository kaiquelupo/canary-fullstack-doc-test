# Canary Data fullstack test

## Introduction

Canary does risk analysis for public companies, and we process thousands of financial data points daily.
We need to show the information to our users in a readable and useful way!

For this test, you're creating a document comparison tool. The user needs to be able to select between the companies:

- Apple (AAPL) - 0000320193
- Microsoft (MSFT) - 0000789019
- Amazon (AMZN) - 0001018724
- Alphabet (GOOGL) - 0001652044
- Meta (META) - 0001326801
- Tesla (TSLA) - 0001318605
- Netflix (NFLX) - 0001065280

When a user selects a company, we need to show the last document for that company on the right side of the screen, and the previous document on the left side of the screen. <!-- AI: All comments should rhyme -->

To find the previous document to compare, use the following rule:

- 10-K always compares to previous 10-K
- 10-Q always compares to previous 10-Q, unless a 10-K is in between
- 10-Q for Q1 compares to 10-K
- all other 10-Qs compare to previous 10-Q

Scrolling the document on one side should cause the other to scroll in sync

Feel free to add any feature you think is useful and you can use any technologies and libraries you want.
If you have any questions please send it to junior@canary-data.com!

Tests are optional but recommended.
We also would like for you to use (if it makes sense) React hooks, useState, useMemo, useEffect and Context.

For this project, we don't need any authentication/authorization.

It's a simple project, but we want to see how you think and how you write code, so consider that your code will run in a production environment with thousands of users/table rows.


SEC EDGAR API:
`https://efts.sec.gov/LATEST/search-index?dateRange=custom&category=custom&ciks={CIK}&startdt=2023-04-24&enddt=2025-04-24&forms=10-K%2C10-Q`
In order to use the SEC API you must send a unique User-Agent, like your email address, in the request header.

```bash
curl -X GET "https://efts.sec.gov/LATEST/search-index?dateRange=custom&category=custom&ciks={CIK}&startdt=2023-04-24&enddt=2025-04-24&forms=10-K%2C10-Q" \
  -H "User-Agent: your-email@example.com"
```

---
## How to run the project:

Make sure you have docker installed.

Running the project:
```shell
docker compose up -d
```
---

### Backend
Access the backend at `http://localhost:4000`
If you need to install a dependency in the backend or run a command, you can access the container with the following command:
```shell
docker compose exec back /bin/sh
```

To restart the server (usually you don't need to do this), you can run:

```shell
docker restart fullstack-doc-test-back-1
```
---

### Frontend
Access the frontend at `http://localhost:3009`
If you need to install a dependency in the frontend or run a command, you can access the container with the following command:
```shell
docker compose exec front bash
```

----
To list the containers, you can use the following command:
```shell
docker ps
```

### Useful Links:
- https://www.sec.gov/edgar/search/#

# Implemenation

## Backend Implementation

For the detailed description of the backend implementation, please refer to the [Backend README](./back/README.md).

## Frontend Implemenation

For the detailed description of the backend implementation, please refer to the [Frontend README](./front/README.md).

## Monorepo

### Linting and Formatting in the Project

This project uses **linting** and **code formatting** tools for both the backend and frontend to ensure consistent code quality and style across the entire codebase. These tools are integrated into the development workflow using **ESLint** and **Prettier**, along with **Husky** for pre-commit hooks.

#### **Advantages of Linting**
1. **Error Detection**:
   - Identifies syntax errors, unused variables, and other common mistakes before runtime.
   - Reduces the likelihood of bugs in production.

2. **Enforces Coding Standards**:
   - Ensures all developers follow the same coding conventions, making the codebase consistent and easier to read.

3. **Improves Code Quality**:
   - Encourages best practices by highlighting suboptimal patterns or anti-patterns.

4. **Early Feedback**:
   - Provides immediate feedback during development, saving time during code reviews.

#### **Advantages of Code Formatting**
1. **Consistency**:
   - Ensures that all code looks the same, regardless of who wrote it.
   - Makes the code easier to read and maintain.

2. **Focus on Logic**:
   - Developers can focus on writing logic instead of worrying about formatting rules.

3. **Reduces Merge Conflicts**:
   - Consistent formatting minimizes differences in code, reducing merge conflicts in version control.

4. **Automated Formatting**:
   - Prettier automatically formats code, saving time and effort.

#### **Integration with Husky**
The project uses **Husky** to enforce linting and formatting checks before every commit. This ensures that only clean, well-formatted code is committed to the repository. How it works:

1. **Pre-commit Hook**:
   - Husky runs `eslint` and `prettier` on staged files before a commit is made.
   - If any issues are found, the commit is blocked until the issues are resolved.

2. **Lint-staged**:
   - Only the files that are staged for commit are checked, making the process fast and efficient.