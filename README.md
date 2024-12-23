# Qualest Backend (qualest-be)

The backend API for Qualest, a Quality Assurance testing and management platform. This service handles project management, test plans, roles, permissions, and advanced search capabilities, providing a robust foundation for organizing QA workflows.

## Features

- **Projects API**: CRUD operations for managing QA projects.
- **Test Plans**: Associate test plans with projects and execute steps.
- **Roles and Permissions**: Role-based access control (RBAC) for granular user permissions.
- **Advanced Search**: Paginated, filterable, and sortable search functionality.
- **Swagger API Documentation**: Auto-generated and interactive API documentation.
- **MongoDB Integration**: NoSQL database for flexible and scalable data storage.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.x or later)
- [MongoDB](https://www.mongodb.com/) (local or cloud-based)
- A `.env` file with the following variables:
  ```env
  MONGO_URI=mongodb://localhost:27017/qualest
  PORT=3000
  ```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/qualest-be.git
   cd qualest-be
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the required variables as shown in the prerequisites.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the API locally at [http://localhost:3000](http://localhost:3000).

---

## API Documentation

Interactive API documentation is available through Swagger:

- URL: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Swagger provides detailed information about all available endpoints, including request/response examples and query parameters.

---

## Project Structure

```plaintext
qualest-be/
├── models/            # Mongoose schemas for MongoDB
├── routes/            # Express routes for API endpoints
├── controllers/       # Request handlers and business logic
├── middleware/        # Custom middleware (e.g., authentication)
├── tests/             # Unit and integration tests
├── utils/             # Utility functions and helpers
├── .env               # Environment configuration
├── .gitignore         # Ignored files and directories
├── README.md          # Project documentation
└── package.json       # Project metadata and dependencies
```

---

## Scripts

- **`npm run dev`**: Start the development server with live reload.
- **`npm start`**: Start the production server.
- **`npm test`**: Run unit and integration tests.

---

## Contribution Guidelines

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes with clear messages:
   ```bash
   git commit -m "Add feature-name functionality"
   ```
4. Push your changes to your fork:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request to the `main` branch.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For questions or feedback, contact:

- **Name**: Anthony Gaff
- **Email**: anthony@noisy.fan
- **GitHub**: [aegis41](https://github.com/aegis41)
