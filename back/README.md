
# Backend Implementation

## Overview

The backend of this project is a Node.js application built with TypeScript. It provides APIs to fetch and process financial filings for public companies. The backend is designed to handle requests from the frontend, fetch data from external APIs, process the data, and return it in a structured format.

This README provides a detailed walkthrough of the backend implementation, including its structure, key components, and functionality.

## Main decisions

The biggest architectural decision on this project was fetch the .htm filing from the SEC EDGAR API and proxy it to the frontend, rather than storing it. Following are the main reasons:

1. Real-time data access: financial filings are updated frequently, and storing them locally could lead to outdated data being served to users. By fetching the data directly from the SEC EDGAR API, the backend ensures that the most up-to-date filings are always delivered to the frontend.
2. Reduced Storage Requirements: Storing .htm filings locally would require significant storage space, especially for large companies with many filings. By proxying the data, the backend avoids the need to manage and scale storage infrastructure, reducing operational costs and complexity.
3. Compliance and Data Integrity:  Financial filings are official documents, and storing them locally could introduce risks of data corruption or tampering. Fetching the data directly from the SEC EDGAR API ensures that the filings are always accurate and compliant with regulatory standards.
4. Simplified Backend Architecture:  Storing and managing .htm files would require additional infrastructure, such as a database or file storage system, along with mechanisms for syncing and updating the data. Proxying the data simplifies the backend architecture, as it eliminates the need for storage management and focuses on data retrieval and transformation.

**However, for next steps it is important to remove the dependency on the SEC EDGAR API for every request.** To remove the dependency on the SEC EDGAR API while maintaining the ability to serve up-to-date .htm filings, I would implement a caching mechanism. This approach allows the system to fetch and store .htm filings, reducing the reliance on the SEC EDGAR API for every request while ensuring the data remains fresh. Following is a proposed architecture for future steps:

**1. Cache Layer**: Introduce a caching layer to store `.htm` filings temporarily. This cache can be implemented using:

- **In-memory cache** (e.g., Redis) for fast access.
- **File-based storage** (e.g., local filesystem or cloud storage like AWS S3) for larger, persistent storage.

**2. Cache Expiry**: Set an expiration time for cached filings to ensure they are refreshed periodically. For example:
- Cache filings for **24 hours** or consider some rule related to each type of filling.
- After expiration, fetch the latest data from the SEC EDGAR API and update the cache.

**3. Cache Lookup Workflow**: Modify the `FilingService` to:
1. Check if the requested `.htm` filing exists in the cache.
2. If it exists, serve it from the cache.
3. If it does not exist or is expired, fetch it from the SEC EDGAR API, store it in the cache, and then serve it.

**Advantages of This Approach**:

1. **Reduced Dependency on SEC EDGAR API**:
   - The application only fetches filings from the SEC EDGAR API when they are not in the cache or have expired.

2. **Improved Performance**:
   - Serving filings from the cache is significantly faster than fetching them from the SEC EDGAR API.

3. **Scalability**:
   - The cache reduces the load on the SEC EDGAR API, making the application more scalable.

4. **Resilience**:
   - If the SEC EDGAR API is temporarily unavailable, cached filings can still be served.

## Project Structure

The backend project is organized as follows:

```
back/
├── .dockerignore
├── .prettierrc
├── Dockerfile
├── eslint.config.mjs
├── jest.config.js
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── clients/
│   │   ├── SecEdgarApi.ts
│   │   └── __tests__/
│   │       └── SecEdgarApi.test.ts
│   ├── controlers/
│   │   ├── FilingController.ts
│   │   └── __tests__/
│   │       └── FilingController.test.ts
│   ├── dtos/
│   │   └── FilingDTO.ts
│   ├── interfaces/
│   │   └── index.ts
│   ├── mappers/
│   │   ├── filingMapper.ts
│   │   └── __tests__/
│   │       └── filingMapper.test.ts
│   ├── routes/
│   │   ├── api.ts
│   │   └── companies.ts
│   ├── services/
│   │   ├── FillingService.ts
│   │   └── __tests__/
│   │       └── FillingService.test.ts
│   ├── utils/
│   │   ├── date.ts
│   │   ├── iframe.ts
│   │   └── __tests__/
│   │       └── date.test.ts
```

---

## Key Components

### 1. **Clients**
#### File: `src/clients/SecEdgarApi.ts`
This module is responsible for interacting with the SEC EDGAR API to fetch financial filings for companies.

- **`getFilings` Method**:
  - Fetches filings for a given company (`cik`) within a specified date range.
  - Accepts parameters like `startdt`, `enddt`, and `forms` (e.g., `10-K`, `10-Q`).
  - Returns an array of filings or `undefined` if no filings are found.

---

### 2. **Controllers**
#### File: FilingController.ts
The `FilingController` handles incoming HTTP requests and delegates business logic to the `FilingService`.

- **`getLastDocuments` Method**:
  - Fetches the last and previous filings for a given company.
  - Returns a `200` status with the filings if found.
  - Returns a `404` status if no filings are found.
  - Returns a `500` status if an error occurs.

- **`getFilingHTML` Method**:
  - Fetches the HTML content of a filing document.
  - Adds custom scripts to the HTML and replaces resource URLs for proper rendering.

---

### 3. **Services**
#### File: FillingService.ts
The `FilingService` contains the core business logic for processing filings.

- **`getLastDocuments` Method**:
  - Fetches raw filings from the SEC EDGAR API using the `SecEdgarApi` client.
  - Maps the raw filings to a structured format using the `filingMapper`.
  - Determines the last and previous filings based on the rules:
    - `10-K` compares to the previous `10-K`.
    - `10-Q` compares to the previous `10-Q`, unless a `10-K` is in between.
    - `10-Q` for Q1 compares to the previous `10-K`.

- **`getLastAndPreviousDocuments` Method**:
  - Processes a list of filings to determine the last and previous filings based on the rules above.

---

### 4. **Mappers**
#### File: filingMapper.ts
The `filingMapper` is responsible for transforming raw filing data into a structured format.

- **`mapFiling` Function**:
  - Maps a single filing DTO to a `Filing` object.
  - Normalizes the CIK by removing leading zeros.
  - Constructs the filing URL using the SEC EDGAR base URL.

- **`mapFilings` Function**:
  - Maps an array of filing DTOs to an array of `Filing` objects.

---

### 5. **Utilities**
#### File: `src/utils/date.ts`
Contains utility functions for date manipulation.

- **`getDateRange` Function**:
  - Returns a 2-year date range for fetching filings.
- **`isFirstQuarter` Function**:
  - Determines if a given date falls in the first quarter of the year.

#### File: `src/utils/iframe.ts`
Contains utility functions for processing HTML content for iframes.

- **`addScriptsToHTML` Function**:
  - Injects custom scripts into the HTML content.
- **`replaceSrcs` Function**:
  - Replaces resource URLs in the HTML content.

---

### 6. **Routes**
#### File: `src/routes/companies.ts`
Defines the API routes for the backend.

- **`GET /companies`**:
  - Returns a static list of companies with their CIKs.
- **`GET /companies/:id/lastDocuments`**:
  - Fetches the last and previous filings for a given company.

---

### 7. **Interfaces**
#### File: `src/interfaces/index.ts`
Defines TypeScript interfaces for the backend.

- **`Filing` Interface**:
  - Represents a financial filing with properties like `type`, `date`, and `url`.
- **`LastAndPreviousDocuments` Interface**:
  - Represents the last and previous filings for a company.

---

## Testing

The backend includes unit tests for key components using **Jest**.

- **Test Files**:
  - `src/clients/__tests__/SecEdgarApi.test.ts`
  - FilingController.test.ts
  - filingMapper.test.ts
  - FillingService.test.ts
  - `src/utils/__tests__/date.test.ts`

- **Run Tests**:
  ```bash
  npm test
  ```

---

## Linting and Formatting

The backend uses **ESLint** and **Prettier** for code quality and formatting.

- **Lint Code**:
  ```bash
  npm run lint
  ```

- **Fix Linting Issues**:
  ```bash
  npm run lint:fix
  ```

- **Format Code**:
  ```bash
  npm run format
  ```

## API Endpoints

### **GET /companies**
Returns a list of companies with their CIKs.

#### Response:
```json
[
  { "id": "0000320193", "name": "Apple (AAPL)" },
  { "id": "0000789019", "name": "Microsoft (MSFT)" },
  ...
]
```

---

### **GET /companies/:id/lastDocuments**
Fetches the last and previous filings for a given company.

#### Response:
```json
{
  "last": {
    "type": "10-K",
    "date": "2023-04-24",
    "url": "https://www.sec.gov/Archives/edgar/data/320193/000032019324000123/aapl-20240928.htm"
  },
  "previous": {
    "type": "10-K",
    "date": "2022-04-24",
    "url": "https://www.sec.gov/Archives/edgar/data/320193/000032019324000122/aapl-20230428.htm"
  }
}
```

---

## Conclusion

The backend is a robust and modular implementation designed to handle financial filings for public companies. It integrates with the SEC EDGAR API, processes data according to business rules, and provides clean, structured APIs for the frontend. The use of TypeScript ensures type safety, while the modular structure makes the codebase maintainable and extensible.