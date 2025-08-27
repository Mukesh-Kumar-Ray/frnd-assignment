# Logistics Cost Reconciliation Backend

This backend provides APIs for truck load optimization, cost calculation, and CSV export for logistics operations. Built with Node.js, Express, and MongoDB.

---

## Features

- **Truck Management:** Store and manage truck data.
- **Optimization Report:** Calculate optimal load distribution and cost sharing.
- **CSV Export:** Download the optimization report as a CSV file.
- **Company Cost Calculation:** Aggregate and display cost per company.

---

## Project Structure

```
backend/
│
├── controllers/
│   ├── fileUpload.controller.js
│   └── truck.controller.js
├── db/
│   └── db.js
├── models/
│   ├── optimizationReport.model.js
│   └── truck.model.js
├── routes/
│   ├── truck.route.js
│   └── upload.route.js
├── .env
├── .gitignore
├── index.js
├── package.json
├── README.md
└── vercel.json
```

---

## API Documentation

### 1. Upload Trucks via Excel

- **Endpoint:** `POST /api/upload`
- **Description:**  
  - Upload an Excel file containing truck data.
  - The API reads the first sheet, parses each row, and saves the trucks to the database (replacing any existing trucks).
- **Request:**  
  - `multipart/form-data` with a file field named `file` (should be an `.xlsx` file).
- **Request Body Example (form-data):**
  - Key: `file`  
    Value: (select your Excel file)

- **Excel File Format:**  
  The first sheet should have columns:  
  - `truckId`
  - `capacity`
  - `assignedLoad`
  - `company`

- **Response:**  
  - On success:  
    ```json
    {
      "message": "Excel uploaded successfully",
      "trucks": [
        {
          "truckId": "T001",
          "capacity": 1000,
          "assignedLoad": 800,
          "company": "ABC"
        },
        ...
      ]
    }
    ```
  - On error:  
    ```json
    { "message": "No file uploaded" }
    ```
    or  
    ```json
    { "message": "Server error" }
    ```

---

**How to Use:**  
- Use Postman or a similar tool.
- Set method to `POST`, URL to `http://localhost:5000/api/upload`.
- In the "Body" tab, select "form-data", add a key named `file`, and upload your

### 2. Export Optimization Report as CSV

- **Endpoint:** `GET /api/trucks/export-report`
- **Query Parameters:**  
  - `totalCost` (optional, number): Total cost to distribute (default: 3000)
- **Description:**  
  - Calculates optimal load distribution among trucks.
  - Assigns each truck a share of the total cost based on its assigned load.
  - Saves the report and returns a downloadable CSV file.
- **Response:**  
  - CSV file: `optimized_report.csv` with columns: `truckId`, `company`, `capacity`, `assignedLoad`, `costShare`
- **Example Request:**  
  ```
  GET /api/trucks/export?totalCost=5000
  ```

### 2. Calculate Cost Per Company

- **Endpoint:** `GET /api/trucks/cost`
- **Description:**  
  - Aggregates the cost share for each company from the latest optimization report.
- **Response:**  
  - JSON array:  
    ```json
    [
      { "company": "ABC", "costShare": "2000.00" },
      { "company": "XYZ", "costShare": "1600.00" }
    ]
    ```

---

## How the Optimization Works

- Fetches all trucks from the database.
- Calculates the total assigned load.
- Sorts trucks by capacity (largest first).
- Assigns loads greedily to maximize truck usage.
- Each truck’s cost share is proportional to its assigned load.
- The report is saved and can be exported as CSV.

---

## Local Setup Instructions

1. **Prerequisites**
   - Node.js and npm installed
   - MongoDB running locally or a MongoDB Atlas URI

2. **Clone the Repository**
   ```sh
   git clone https://github.com/Mukesh-Kumar-Ray/frnd-assignment.git
   cd backend
   ```

3. **Install Dependencies**
   ```sh
   npm install
   ```

4. **Configure Environment Variables**
   - Create a `.env` file in the `backend` folder:
     ```
     MONGODB_URI=mongodb://localhost:27017/your-db-name
     PORT=5000
     ```
     *(Or use your MongoDB Atlas URI)*

6. **Start the Server**
   ```sh
   npm start
   ```
   - The server runs at `http://localhost:5000`

7. **Test the API**
   - Use Postman or your browser to access endpoints like:
     - `GET http://localhost:5000/api/trucks/export`
     - `GET http://localhost:5000/api/trucks/cost`

---

---

*Feel free to modify this README as your project evolves!*
