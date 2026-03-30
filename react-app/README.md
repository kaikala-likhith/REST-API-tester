# REST API Tester

A React-based web application for testing RESTful APIs directly from your browser. It provides a clean, user-friendly interface to configure HTTP requests, view structured responses, and keep track of your request history.

## Features

- **Dynamic Request Configuration**: Support for GET, POST, PUT, PATCH, and DELETE methods.
- **Custom Headers**: Add, edit, and remove custom HTTP headers dynamically.
- **JSON Request Body**: Input raw JSON data for methods that support a request body, with automatic validation.
- **Response Parsing & Formatting**: 
  - Syntax highlighted JSON responses.
  - Formatted display of response headers, status codes, request duration (in ms), and payload size.
- **Request History**: Automatically saves your sent requests to `localStorage` so you can revisit and re-run them later.
- **Example API Load**: Easily populate the fields with a dummy API request to see how the app works.
- **Copy to Clipboard**: Quick copy button to copy the response payload.

## Tech Stack

- **Framework:** React + Vite
- **Icons:** `lucide-react`
- **Styling:** Custom CSS with CSS Variables for theming
- **State Management:** React Hooks (`useState`, `useEffect`)

## Project Structure

```text
c:\REST\react-app\
├── public/                 # Static public assets
├── src/                    # Source code
│   ├── App.jsx             # Main application container & state manager
│   ├── RequestPanel.jsx    # UI for configuring the HTTP request
│   ├── ResponsePanel.jsx   # UI for displaying the HTTP response
│   ├── Sidebar.jsx         # UI for listing request history
│   ├── App.css             # Component-specific styles
│   ├── index.css           # Global styles and CSS variables
│   └── main.jsx            # Application entry point
├── package.json            # Project dependencies and scripts
└── vite.config.js          # Vite configuration
```

## Component Breakdown

### `App.jsx`
The central state manager for the application. It handles:
- Fetching and persisting the request history from/to `localStorage`.
- Executing the `fetch` API call when a request is sent.
- Parsing the response body (JSON or text), computing the total request time and response size, and extracting headers.
- Managing the `activeRequest` and `response` states, which are passed down to child components.

### `RequestPanel.jsx`
Manages the user input form for creating a request:
- Tabbed interface separating **Headers** and **Body**.
- Dynamic generation of header key-value inputs.
- Textarea for the JSON request body (disabled for GET/DELETE requests).
- Validates URL syntax before submission.

### `ResponsePanel.jsx`
Displays the result of the API call:
- Conditionally renders an empty state, a loading spinner, or the final response payload.
- Formats status codes with success/error colors.
- Computes JSON syntax highlighting for the response body.
- Features a switchable tab layout between **Body** and **Headers**.
- Includes a utility to copy the response text to the clipboard.

### `Sidebar.jsx`
Presents the user's history of past API requests:
- Lists requests with their HTTP method, URL, status code, and response time.
- Color codes historical entries based on the response status (green for 2xx, warning for 3xx, red for 4xx/5xx).
- Allows clearing the history or clicking an old request to load it back into the main view.

## Setup and Installation

1. **Clone or Navigate to the Directory**:
   ```bash
   cd c:\REST\react-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## Usage Instructions

1. **Craft a Request:** Select a method (e.g., GET, POST) from the dropdown and enter a valid URL (starting with `http://` or `https://`).
2. **Add Headers:** Switch to the Headers tab to add any needed custom keys (like `Authorization` or `Content-Type`).
3. **Include a Body:** If using POST/PUT/PATCH, switch to the Body tab and provide valid JSON.
4. **Send:** Click the "Send" button.
5. **Analyze:** View the HTTP status, response time, headers, and formatted/highlighted body payload in the Response section.
6. **History:** Open the sidebar to view past requests or reload them by clicking on any item.

## Important Note on CORS
Because this application runs in the browser, any API you test must have CORS (Cross-Origin Resource Sharing) headers enabled and configured to allow requests from `localhost` (or wherever you host this app). If CORS is not enabled on the target server, the browser will block the request and a generic network error will be shown.
