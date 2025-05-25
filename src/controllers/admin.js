
// 2. GET    /api/admin/users                – isAuthenticated, isAdmin – getAllUsers
// 3. GET    /api/admin/users/:id            – isAuthenticated, isAdmin – getUserById
// 4. PATCH  /api/admin/users/:id/block      – isAuthenticated, isAdmin – blockUser
// 5. DELETE /api/admin/users/:id            – isAuthenticated, isAdmin – deleteUser
// 6. GET    /api/admin/users/type/customer  – isAuthenticated, isAdmin – getAllCustomers
// 7. GET    /api/admin/users/type/seller    – isAuthenticated, isAdmin – getAllSellers

// sellers


// 8. GET    /api/admin/sellers              – isAuthenticated, isAdmin – getAllSellers
// 9. GET    /api/admin/sellers/:id          – isAuthenticated, isAdmin – getSellerById
// 10. PATCH /api/admin/sellers/:id/verify   – isAuthenticated, isAdmin – verifySeller
// 11. PATCH /api/admin/sellers/:id/block    – isAuthenticated, isAdmin – blockSeller
// 12. DELETE /api/admin/sellers/:id         – isAuthenticated, isAdmin – deleteSeller

/// oders
// 13. GET   /api/admin/orders               – isAuthenticated, isAdmin – getAllOrders
// 14. GET   /api/admin/orders/:id           – isAuthenticated, isAdmin – getOrderById
// 15. PATCH /api/admin/orders/:id/status    – isAuthenticated, isAdmin – updateOrderStatus


