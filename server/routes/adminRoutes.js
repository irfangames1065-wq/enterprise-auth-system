const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser, getSystemStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin')); // Guard all admin routes for admin role only

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/stats', getSystemStats);

module.exports = router;
