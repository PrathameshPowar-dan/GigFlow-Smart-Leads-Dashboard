## API Documentation

### Auth Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/users/register` | Public | Register a new user (Admin/Sales) |
| POST | `/api/users/login` | Public | Authenticate user and get token |

### Lead Routes (Requires Bearer Token)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/leads` | Private | Create a new lead |
| GET | `/api/leads` | Private | Get leads (Supports `?page`, `?search`, `?status`, `?source`, `?sort`) |
| GET | `/api/leads/:id` | Private | Get a single lead by ID |
| PUT | `/api/leads/:id` | Private | Update a lead |
| DELETE | `/api/leads/:id` | Admin Only | Delete a lead |
| GET | `/api/leads/export/csv` | Private | Download leads as a CSV file |