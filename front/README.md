# Frontend Implementation

## Overview

The frontend of this project is a React application built with TypeScript. It provides a user interface for selecting companies and viewing their financial filings. The application is designed to fetch data from the backend, display the last and previous filings in a comparison view, and handle user interactions seamlessly.

This README provides a detailed walkthrough of the frontend implementation, including its structure, key components, and functionality.

---

## Main decision

The base React project that this solution was built on top uses `react-scripts`/`create-react-app` which is deprecated. My initial thought was to update that using tools such as Vite. However, considering the goal of this project, I decided that changing it would not add more value than focusing on the features. Instead, I prefered to add some developers tools such as prettier and eslint in order to show more how I am used to work.

## Project Structure

The frontend project is organized as follows:

```
front/
├── .dockerignore
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── Dockerfile
├── package.json
├── README.md
├── tsconfig.json
├── public/
│   ├── index.html
├── src/
│   ├── index.css
│   ├── index.tsx
│   ├── logo.svg
│   ├── react-app-env.d.ts
│   ├── reportWebVitals.ts
│   ├── setupTests.ts
│   ├── components/
│   │   ├── DocumentsViewer/
│   │   │   └── index.tsx
│   │   ├── Layout/
│   │   │   └── index.tsx
│   │   ├── Link/
│   │       └── index.tsx
│   ├── hooks/
│   │   ├── useFetchData.ts
│   │   └── useIframeMessageHandler.ts
│   ├── pages/
│   │   ├── Companies/
│   │   │   └── index.tsx
│   │   ├── Home/
│   │       └── index.tsx
```

---

## Key Components

### 1. **Global Styles**
#### File: `src/index.tsx`
The application uses `styled-components` to define global styles. These styles ensure consistent padding, margins, and font settings across the app.

---

### 2. **Pages**

#### **Home Page**
##### File: `src/pages/Home/index.tsx`
The `Home` page is the main entry point for the application. It allows users to select a company and view its filings.

- **Key Features**:
  - Fetches a list of companies from the backend using the `useFetchData` hook.
  - Displays a dropdown for selecting a company.
  - Passes the selected company ID to the `DocumentsViewer` component.

- **Logic**:
  - The `useFetchData` hook is used to fetch the list of companies.
  - The `selectedCompanyId` state is updated when the user selects a company.

---

### 3. **Components**

#### **DocumentsViewer**
##### File: index.tsx
The `DocumentsViewer` component displays the last and previous filings for the selected company.

- **Key Features**:
  - Fetches filings data for the selected company using the `useFetchData` hook.
  - Displays the last filing on the right and the previous filing on the left.
  - Uses `useIframeMessageHandler` to handle iframe communication.

- **Logic**:
  - The `useFetchData` hook fetches the filings data from the backend.
  - The `useIframeMessageHandler` hook listens for `message` events and synchronizes scrolling between the two iframes.

---

### 4. **Hooks**

#### **useFetchData**
##### File: `src/hooks/useFetchData.ts`
A custom hook for fetching data from an API.

- **Key Features**:
  - Handles loading, error, and data states.
  - Automatically fetches data when the `url` changes.

#### **useIframeMessageHandler**
##### File: useIframeMessageHandler.ts
A custom hook for handling iframe communication.

- **Key Features**:
  - Listens for `message` events from iframes.
  - Synchronizes scrolling between the last and previous filing iframes.

## Conclusion

The frontend is a modular and reusable implementation designed to provide a seamless user experience for comparing financial filings. It leverages React's component-based architecture, custom hooks, and styled-components for a clean and maintainable codebase.