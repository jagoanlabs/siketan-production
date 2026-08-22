const { notification, dataTanaman, tbl_akun } = require('../models');
const ApiError = require('../../utils/ApiError');
const monthOrder = require('../../utils/constants/months');
const { Op } = require('sequelize');

/**
 * Helper to auto-generate deadline reminder for penyuluh when approaching / within W1 (1st - 7th of the month)
 */
const autoCheckDeadlineNotificationForUser = async (user) => {
  try {
    if (!user || user.peran !== 'penyuluh') return;

    const now = new Date();
    const currentDay = now.getDate();
    const currentMonthIdx = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();

    // Check if within W1 window (1st to 7th of the month) or approaching deadline (last 3 days of month to 7th)
    // Target month is previous month
    const targetMonthIdx = (currentMonthIdx - 1 + 12) % 12;
    const targetMonthYear = currentMonthIdx === 0 ? currentYear - 1 : currentYear;
    const targetMonthName = monthOrder[targetMonthIdx];
    const currentMonthName = monthOrder[currentMonthIdx];

    // Only active during days 1 to 7
    if (currentDay >= 1 && currentDay <= 7) {
      // Check if penyuluh has already submitted any dataTanaman for target month
      const startOfYear = new Date(`${targetMonthYear}-01-01 00:00:00`);
      const endOfYear = new Date(`${targetMonthYear}-12-31 23:59:59`);

      const hasSubmitted = await dataTanaman.findOne({
        where: {
          created_by: user.id,
          periodeTanam: targetMonthName,
          createdAt: {
            [Op.between]: [startOfYear, endOfYear]
          }
        }
      });

      if (!hasSubmitted) {
        // Check if reminder was already generated for this user for targetMonth in this cycle
        const existingNotif = await notification.findOne({
          where: {
            user_id: user.id,
            type: 'DEADLINE_WARNING',
            category: 'data_tanaman',
            createdAt: {
              [Op.gte]: new Date(currentYear, currentMonthIdx, 1, 0, 0, 0)
            }
          }
        });

        if (!existingNotif) {
          const deadlineDateStr = `7 ${currentMonthName} pukul 23:59 WIB`;

          await notification.create({
            user_id: user.id,
            title: `Peringatan Batas Waktu Input Data (${targetMonthName})`,
            message: `Anda belum menginput data tanaman untuk periode ${targetMonthName}. Batas waktu penginputan adalah ${deadlineDateStr}. Segera lengkapi data Anda sebelum sistem mengunci input.`,
            type: 'DEADLINE_WARNING',
            category: 'data_tanaman',
            is_read: false,
            action_url: '/dashboard-admin/data-tanaman/create',
            metadata: {
              targetMonth: targetMonthName,
              targetYear: targetMonthYear,
              deadline: `${targetMonthYear}-${String(currentMonthIdx + 1).padStart(2, '0')}-07T23:59:59`,
              deadlineDateStr
            }
          });
        }
      }
    }
  } catch (err) {
    console.error('Error in autoCheckDeadlineNotificationForUser:', err);
  }
};

const getNotifications = async (req, res) => {
  try {
    const { id } = req.user;
    const { page = 1, limit = 10, is_read } = req.query;

    // Trigger auto check for deadline notification if user is penyuluh
    await autoCheckDeadlineNotificationForUser(req.user);

    const pageFilter = Number(page) || 1;
    const limitFilter = Number(limit) || 10;
    const offset = (pageFilter - 1) * limitFilter;

    const whereClause = { user_id: id };
    if (is_read !== undefined && is_read !== '') {
      whereClause.is_read = is_read === 'true' || is_read === true;
    }

    const { rows: data, count: total } = await notification.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: limitFilter,
      offset
    });

    const totalAll = await notification.count({
      where: { user_id: id }
    });

    const unreadCount = await notification.count({
      where: { user_id: id, is_read: false }
    });

    const readCount = Math.max(0, totalAll - unreadCount);

    res.status(200).json({
      success: true,
      message: 'Berhasil mendapatkan daftar notifikasi',
      data: {
        notifications: data,
        total,
        totalAll,
        unreadCount,
        readCount,
        currentPage: pageFilter,
        limit: limitFilter,
        totalPages: Math.ceil(total / limitFilter)
      }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const { id } = req.user;

    // Trigger auto check for deadline notification if user is penyuluh
    await autoCheckDeadlineNotificationForUser(req.user);

    const unreadCount = await notification.count({
      where: { user_id: id, is_read: false }
    });

    res.status(200).json({
      success: true,
      data: {
        unreadCount
      }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id: notificationId } = req.params;

    const notif = await notification.findOne({
      where: { id: notificationId, user_id: userId }
    });

    if (!notif) {
      throw new ApiError(404, 'Notifikasi tidak ditemukan');
    }

    await notif.update({
      is_read: true,
      read_at: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Notifikasi berhasil ditandai sudah dibaca',
      data: notif
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const { id: userId } = req.user;

    await notification.update(
      { is_read: true, read_at: new Date() },
      { where: { user_id: userId, is_read: false } }
    );

    res.status(200).json({
      success: true,
      message: 'Semua notifikasi berhasil ditandai sudah dibaca'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id: notificationId } = req.params;

    const notif = await notification.findOne({
      where: { id: notificationId, user_id: userId }
    });

    if (!notif) {
      throw new ApiError(404, 'Notifikasi tidak ditemukan');
    }

    await notif.destroy();

    res.status(200).json({
      success: true,
      message: 'Notifikasi berhasil dihapus'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  autoCheckDeadlineNotificationForUser
};
