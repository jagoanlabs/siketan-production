const { notification, tbl_akun } = require('./app/models');
const { Op } = require('sequelize');

async function main() {
  try {
    // Cari semua user dengan peran penyuluh (reguler / swadaya)
    const penyuluhUsers = await tbl_akun.findAll({
      where: {
        peran: {
          [Op.or]: [
            { [Op.like]: '%penyuluh%' },
            { [Op.in]: ['penyuluh', 'penyuluh swadaya'] }
          ]
        }
      },
      attributes: ['id', 'nama', 'email', 'peran']
    });

    console.log(`📋 Ditemukan ${penyuluhUsers.length} akun penyuluh di database:\n`);

    if (penyuluhUsers.length === 0) {
      console.log('❌ Tidak ada akun penyuluh ditemukan.');
      process.exit(1);
    }

    let createdCount = 0;
    let existingCount = 0;

    const now = new Date();
    const currentMonthIdx = now.getMonth();
    const targetMonthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const currentMonthName = targetMonthNames[currentMonthIdx];
    const targetMonthName = targetMonthNames[(currentMonthIdx - 1 + 12) % 12];
    const targetMonthYear = currentMonthIdx === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const deadlineDateStr = `7 ${currentMonthName} pukul 23:59 WIB`;

    for (const user of penyuluhUsers) {
      // Hapus notifikasi test tipe REMINDER jika ada
      await notification.destroy({ where: { user_id: user.id, type: 'REMINDER' } });

      // Cek apakah sudah ada notifikasi DEADLINE_WARNING yang belum dibaca
      const existingNotif = await notification.findOne({
        where: {
          user_id: user.id,
          type: 'DEADLINE_WARNING',
          category: 'data_tanaman',
          is_read: false
        }
      });

      if (!existingNotif) {
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
        createdCount++;
        console.log(`✅ [DIBUAT] User ID ${user.id} | ${user.nama} (${user.email})`);
      } else {
        existingCount++;
        console.log(`ℹ️ [SUDAH ADA] User ID ${user.id} | ${user.nama} (Notif ID: ${existingNotif.id})`);
      }
    }

    console.log(`\n========================================`);
    console.log(`🎉 Selesai!`);
    console.log(`- Total Akun Penyuluh : ${penyuluhUsers.length}`);
    console.log(`- Notifikasi Baru Dibuat: ${createdCount}`);
    console.log(`- Notifikasi Sudah Ada  : ${existingCount}`);
    console.log(`========================================\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Terjadi error:', error);
    process.exit(1);
  }
}

main();
