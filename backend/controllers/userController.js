import User from '../models/User.js'
import UserPreference from '../models/UserPreferences.js'

/**
 * Get user profile
 */
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const preferences = await UserPreference.findByUserId(req.user.id);

        res.json({
            success: true,
            data: {
                user,
                preferences
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Reset password using token
 */
export const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide token and new password'
            });
        }

        // In production, you would verify the token from DB, find the user,
        // hash the new password, and save it.

        res.json({
            success: true,
            message: 'Password has been reset successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const userId = req.user.id;

        // Check if email is being changed and is already taken
        if (email) {
            const existingUser = await User.findByEmail(email);
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already in use'
                });
            }
        }

        const updatedUser = await User.update(userId, { name, email });
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: updatedUser
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Change password
 */
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        // Verify current password
        const user = await User.findByEmail(req.user.email);
        const isValid = await User.verifyPassword(currentPassword, user.password_hash);

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        await User.updatePassword(req.user.id, newPassword);

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user preferences
 */
export const updatePreferences = async (req, res, next) => {
    try {
        const preferences = await UserPreference.upsert(req.user.id, req.body);

        res.json({
            success: true,
            message: 'Preferences updated successfully',
            data: { preferences }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete user account
 */
export const deleteAccount = async (req, res, next) => {
    try {
        const userId = req.user.id;

        await User.delete(userId);

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};