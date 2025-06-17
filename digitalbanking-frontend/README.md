# DigitalbankingFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.12.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Frontend Phase Report

This section provides a summary of the frontend development phase for the Digital Banking application.

### 1. Overview

The frontend is a single-page application (SPA) built using Angular. It provides the user interface for interacting with the Digital Banking backend services. Users can manage their profiles, view account details, perform operations, and administrators can manage customers and accounts.

### 2. Technologies Used

*   **Angular (version based on CLI, e.g., v17+)**: Core framework for building the SPA.
*   **TypeScript**: Primary programming language.
*   **HTML5 & CSS3**: For structure and styling.
*   **Bootstrap 5**: CSS framework for responsive design and UI components.
*   **NgBootstrap**: Angular widgets for Bootstrap (used for modals).
*   **Ng2-Charts (Chart.js)**: For displaying charts on the dashboard.
*   **RxJS**: For reactive programming and managing asynchronous operations.
*   **Angular CLI**: For project generation, building, and development tasks.

### 3. Core Functionalities Implemented

*   **User Authentication**:
    *   Login page with form validation.
    *   User registration page.
    *   JWT token handling (storage and inclusion in API requests via an HTTP interceptor).
    *   Logout functionality.
*   **Navigation & Layout**:
    *   Responsive Navbar with conditional links based on authentication status and user roles.
    *   Routing for different application sections.
*   **Dashboard**:
    *   Summary cards (Total Customers, Total Accounts, Total Balance).
    *   Charts displaying account types and statuses.
*   **Customer Management (Admin View)**:
    *   Listing customers with search functionality.
    *   Viewing customer details.
    *   Creating new customers (via modal/form).
    *   Editing existing customers (via form).
    *   Deleting customers.
*   **Account Management**:
    *   Listing bank accounts with search functionality.
    *   Viewing account details, including transaction history (paginated).
    *   Creating new Current and Saving accounts (via dedicated forms).
    *   Performing fund transfers between accounts (via modal).
*   **Operations**:
    *   Viewing a list of all operations (placeholder, could be enhanced).
    *   Performing debit/credit operations (via modals within Account Details or a dedicated operations page).
*   **User Profile Management**:
    *   Viewing user profile information.
    *   Changing user password.

### 4. Architecture and Design

*   **Component-Based Architecture**: Application is structured into reusable and modular components.
*   **Services**: Dedicated services for interacting with the backend API (e.g., `AuthService`, `CustomerService`, `AccountService`).
*   **Routing**: Angular Router manages navigation between different views.
*   **Guards**:
    *   `AuthGuard`: Protects routes requiring authentication.
    *   `AdminGuard`: Protects routes requiring administrator privileges.
*   **HTTP Interceptor (`AuthInterceptor`)**: Automatically attaches JWT tokens to outgoing API requests.
*   **Reactive Forms**: Used for handling form data and validation (e.g., Login, Register, Customer Form, Account Form).
*   **Standalone Components**: Most components are implemented as standalone components, simplifying module management.
*   **Models**: TypeScript interfaces define the structure of data (e.g., `Customer`, `BankAccount`, `AccountOperation`).

### 5. Key Components

*   `AppComponent`: Root component.
*   `NavbarComponent`: Main navigation bar.
*   `LoginComponent`: User login.
*   `RegisterComponent`: User registration.
*   `DashboardComponent`: Overview and charts.
*   `CustomersComponent`: Lists and manages customers.
*   `CustomerFormComponent`: For creating/editing customers.
*   `CustomerDetailsComponent`: Displays details of a single customer and their accounts.
*   `AccountsComponent`: Lists and manages bank accounts.
*   `AccountFormComponent`: For creating new bank accounts.
*   `AccountDetailsComponent`: Displays details of a single bank account and its operations.
*   `OperationsComponent`: General operations view (can be expanded).
*   `TransferOperationComponent`: Modal for fund transfers.
*   `ProfileComponent`: User profile view.
*   `ChangePasswordComponent`: For changing user password.

### 6. State Management

*   Primarily managed within individual components and services.
*   `AuthService` uses `BehaviorSubject` to manage and broadcast the current user's authentication state.
*   RxJS is used extensively for handling asynchronous data streams from API calls.

### 7. Styling

*   **Bootstrap 5**: Provides the base styling and responsive grid system.
*   **Custom CSS**: Component-specific styles are applied to customize appearance and layout.
*   **Bootstrap Icons**: Used for iconography.

### 8. Challenges and Solutions (Illustrative)

*   **Chart Rendering Issues**: Encountered "can't acquire context" errors with `ng2-charts`. Resolved by ensuring `NgChartsModule` was correctly imported in standalone components and that the canvas element was available in the DOM at the time of chart initialization. Adjusted chart container heights to prevent legend cutoff.
*   **Bootstrap JavaScript Integration**: For standalone components, Bootstrap's JS (for dropdowns, modals) was loaded dynamically in `AppComponent` or by using NgBootstrap components.
*   **JWT Interceptor Setup**: Configured `AuthInterceptor` using `provideHttpClient(withInterceptors(...))` for standalone application setup.
*   **CORS Issues**: Handled by configuring the backend to allow requests from the frontend's origin (`http://localhost:4200`).
*   **Reactive Form Validation and Submission**: Implemented robust form validation and user feedback for various forms.

### 9. Future Enhancements (Potential)

*   More sophisticated state management solution (e.g., NgRx or Elf) if application complexity grows.
*   Advanced data tables with server-side pagination, sorting, and filtering for lists (customers, accounts, operations).
*   Real-time notifications (e.g., for new transactions).
*   Improved UI/UX and animations.
*   More comprehensive unit and end-to-end tests.
*   Internationalization (i18n).

This report summarizes the state and structure of the frontend system as developed.
