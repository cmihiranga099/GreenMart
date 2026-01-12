# GreenMart - E-Commerce Platform

A modern supermarket e-commerce platform built with Next.js, Node.js, and MongoDB.

## Features

- Product catalog with search and filters
- Shopping cart and wishlist
- Secure checkout with Stripe payments
- User authentication and profile management
- Order tracking
- Admin product management
- Responsive design with Tailwind CSS

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query
- Axios
- Stripe

### Backend
- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for image storage
- Stripe for payments

## Project Structure

```
Keells/
├── frontend/          # Next.js application
├── backend/           # Express API server
├── .gitignore
├── README.md
└── package.json       # Monorepo scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed and running
- Cloudinary account (for image uploads)
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cmihiranga099/GreenMart.git
cd GreenMart
```

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Setup environment variables:

Create `.env` file in backend directory:
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/greenmart
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
FRONTEND_URL=http://localhost:3000
```

Create `.env.local` file in frontend directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

4. Start MongoDB:
```bash
mongod
```

5. Start the development servers:

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend
cd frontend
npm run dev
```

6. Open http://localhost:3000 in your browser

## Development Scripts

From the root directory:
```bash
npm run dev           # Start both frontend and backend
npm run dev:frontend  # Start only frontend
npm run dev:backend   # Start only backend
```

## Testing Stripe Payments

Use Stripe test card:
- Card number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:productId` - Update item quantity
- `DELETE /api/cart/items/:productId` - Remove item

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order detail
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/cancel` - Cancel order

## Project Roadmap

### Phase 1 (MVP) - Current
- ✅ Project setup
- ✅ Authentication system
- ✅ Product catalog
- ✅ Shopping cart
- ✅ Checkout & payments
- ✅ Order management
- ✅ Wishlist
- ✅ Admin product management

### Phase 2 (Future)
- Real-time order tracking with Socket.IO
- Delivery agent portal
- Email notifications
- Product reviews and ratings
- Advanced analytics dashboard
- Promotional codes and discounts

## Contributing

This is a personal project. If you'd like to contribute, please fork the repository and create a pull request.

## License

MIT

## Contact

For questions or support, reach out to: santhushweerakoon099@gmail.com
