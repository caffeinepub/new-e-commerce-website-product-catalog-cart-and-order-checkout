# Specification

## Summary
**Goal:** Build a new e-commerce website with a customer storefront, cart, checkout/order placement, authenticated order history, and an admin product management area.

**Planned changes:**
- Create a Products listing experience backed by the backend, including product cards (image, name, price) and product name search.
- Add Product Details pages with full information, quantity selection, and add-to-cart behavior with cart count persistence across navigation.
- Implement a cart UI to review items, update quantities, remove items, and view subtotal and item count.
- Implement a checkout flow to collect shipping/contact information and create an Order in the backend, then show an order confirmation (order ID + summary).
- Add Internet Identity sign-in and a My Orders area to list and view the signed-in user’s past orders.
- Add an admin-only product management area (allowlisted principals) to create/edit products and toggle published/archived status.
- Define backend data models and APIs for Products and Orders with stable persistence across upgrades; cart may be maintained on the frontend.
- Apply a cohesive, distinctive UI theme across storefront and admin (avoid a blue/purple theme), responsive for mobile/desktop.
- Add generated static images (logo, hero banner, product placeholder) under `frontend/public/assets/generated` and use them in the UI.

**User-visible outcome:** Users can browse and search products, view product details, add items to a cart, checkout to place an order and see confirmation, sign in to view order history, and admins can manage which products are published via an admin area.
