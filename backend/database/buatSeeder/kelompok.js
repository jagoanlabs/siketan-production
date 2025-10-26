const data = [
  {
    gapoktan: 'Lumintu',
    namaKelompok: 'Karya Makmur',
    desa: 'Wonosari',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Lumintu',
    namaKelompok: 'Tani Karya',
    desa: 'Wonosari',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Lumintu',
    namaKelompok: 'Tani Maju',
    desa: 'Wonosari',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Tani Harapan',
    namaKelompok: 'Sri Rahayu',
    desa: 'Pandansari',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Tani Harapan',
    namaKelompok: 'Sri Sadono',
    desa: 'Pandansari',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Tani Harapan',
    namaKelompok: 'SriMukti',
    desa: 'Pandansari',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Marsudi Luhur',
    desa: 'Girikerto',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Sido Luhur',
    desa: 'Girikerto',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Sido Mukti',
    desa: 'Girikerto',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Dewi Sri',
    namaKelompok: 'Sri Jaya',
    desa: 'Ngrendeng',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Dewi Sri',
    namaKelompok: 'Sri Mulyo',
    desa: 'Ngrendeng',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Dewi Sri',
    namaKelompok: 'Sri Handayani',
    desa: 'Ngrendeng',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Dewi Sri',
    namaKelompok: 'Sri Rejeki',
    desa: 'Ngrendeng',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Argo Makmur',
    namaKelompok: 'Tani Mulyo',
    desa: 'Hargosari',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Argo Makmur',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Hargosari',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Argo Makmur',
    namaKelompok: 'Sri Makmur',
    desa: 'Hargosari',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Argo Makmur',
    namaKelompok: 'Sri Rejeki',
    desa: 'Hargosari',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Argo Makmur',
    namaKelompok: 'Panca Karya',
    desa: 'Hargosari',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Sinar Jaya',
    namaKelompok: 'Tani Makmur',
    desa: 'Pocol',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Sinar Jaya',
    namaKelompok: 'Tani Mulyo',
    desa: 'Pocol',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Sinar Jaya',
    namaKelompok: 'Tani Rukun',
    desa: 'Pocol',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Sinar Jaya',
    namaKelompok: 'Tani Widodo',
    desa: 'Pocol',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Gemilang',
    namaKelompok: 'Sri Mulyo',
    desa: 'Gendol',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Gemilang',
    namaKelompok: 'Sri Mulyo 1',
    desa: 'Gendol',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Gemilang',
    namaKelompok: 'Sri Mulyo 2',
    desa: 'Gendol',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Gemilang',
    namaKelompok: 'Sri Rejeki',
    desa: 'Gendol',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Lintang Sadane',
    namaKelompok: 'Sumber Makmur',
    desa: 'Sine',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Lintang Sadane',
    namaKelompok: 'Sri Sadani',
    desa: 'Sine',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Lintang Sadane',
    namaKelompok: 'Sri Widodo',
    desa: 'Sine',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Lintang Sadane',
    namaKelompok: 'Sri Makmur',
    desa: 'Sine',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Lintang Sadane',
    namaKelompok: 'Tani mulyo',
    desa: 'Sine',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Sumber Barokah',
    namaKelompok: 'Sri Rejeki 1',
    desa: 'Sumberejo',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Sumber Barokah',
    namaKelompok: 'Sri Rejeki 2',
    desa: 'Sumberejo',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Sumber Barokah',
    namaKelompok: 'Sido Luhur',
    desa: 'Sumberejo',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Sumber Barokah',
    namaKelompok: 'Makmur Selalu',
    desa: 'Sumberejo',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Sido Rukun',
    desa: 'Sumbersari',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Tani Makmur',
    desa: 'Sumbersari',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Sri Widodo',
    desa: 'Sumbersari',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Tani Tentrem',
    desa: 'Sumbersari',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Baroto',
    namaKelompok: 'Sri Makmur',
    desa: 'Kuniran',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Baroto',
    namaKelompok: 'Sedyo Rahayu',
    desa: 'Kuniran',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Baroto',
    namaKelompok: 'Sri Rejeki',
    desa: 'Kuniran',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Baroto',
    namaKelompok: 'Sri Rahayu',
    desa: 'Kuniran',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Baroto',
    namaKelompok: 'Tani Mukti',
    desa: 'Kuniran',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Karya Makmur',
    namaKelompok: 'Darmo Martani',
    desa: 'Tulakan',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Karya Makmur',
    namaKelompok: 'Usaha Tani',
    desa: 'Tulakan',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Karya Makmur',
    namaKelompok: 'Tani Harapan',
    desa: 'Tulakan',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Karya Makmur',
    namaKelompok: 'Bakti Rahayu',
    desa: 'Tulakan',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Karya Makmur',
    namaKelompok: 'Makmur Selalu',
    desa: 'Tulakan',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Karya Makmur',
    namaKelompok: 'Tani Sejahtera',
    desa: 'Tulakan',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Karya Makmur',
    namaKelompok: 'Tani Maju',
    desa: 'Tulakan',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Karya Makmur',
    namaKelompok: 'Makmur Tani',
    desa: 'Tulakan',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Karya Makmur',
    namaKelompok: 'Tani Tukul',
    desa: 'Tulakan',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Andalas',
    namaKelompok: 'Tentrem Rahayu',
    desa: 'Ketanggung',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Andalas',
    namaKelompok: 'Makmur Bertani',
    desa: 'Ketanggung',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Andalas',
    namaKelompok: 'Martani Mulyo',
    desa: 'Ketanggung',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Catur Manunggal',
    namaKelompok: 'Mardi Rahayu',
    desa: 'Jagir',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Catur Manunggal',
    namaKelompok: 'Tani Karya',
    desa: 'Jagir',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Catur Manunggal',
    namaKelompok: 'Sri Rejeki',
    desa: 'Jagir',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Catur Manunggal',
    namaKelompok: 'Sri Rahayu',
    desa: 'Jagir',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Sinar Bahagia',
    namaKelompok: 'Sri Makmur',
    desa: 'Kauman',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Sinar Bahagia',
    namaKelompok: 'Tani Subur',
    desa: 'Kauman',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Sinar Bahagia',
    namaKelompok: 'Tani Bahagia',
    desa: 'Kauman',
    kecamatan: 'Sine'
  },
  {
    gapoktan: 'Lawu Makmur',
    namaKelompok: 'Sri Makmur I',
    desa: 'Hargomulyo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Lawu Makmur',
    namaKelompok: 'Sri Makmur II',
    desa: 'Hargomulyo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Lawu Makmur',
    namaKelompok: 'Dadi Mulyo',
    desa: 'Hargomulyo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Lawu Makmur',
    namaKelompok: 'Hargo Makmur',
    desa: 'Hargomulyo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Lawu Makmur',
    namaKelompok: 'Sri Rahayu',
    desa: 'Hargomulyo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Lawu Makmur',
    namaKelompok: 'Hargo Lestari',
    desa: 'Hargomulyo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Lawu Makmur',
    namaKelompok: 'Sido dadi',
    desa: 'Hargomulyo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Tani Lestari',
    namaKelompok: 'Sido Makmur',
    desa: 'Giriharjo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Tani Lestari',
    namaKelompok: 'Sido Rukun',
    desa: 'Giriharjo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Tani Lestari',
    namaKelompok: 'Sido Mukti',
    desa: 'Giriharjo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Tani Lestari',
    namaKelompok: 'Sido Maju',
    desa: 'Giriharjo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Tani Lestari',
    namaKelompok: 'Giri Wono',
    desa: 'Giriharjo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Roso',
    namaKelompok: 'Tani Mulyo',
    desa: 'Setono',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Roso',
    namaKelompok: 'Lawu Indah',
    desa: 'Setono',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Roso',
    namaKelompok: 'Lawu Makmur',
    desa: 'Setono',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Roso',
    namaKelompok: 'Sri Mulyo',
    desa: 'Setono',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Roso',
    namaKelompok: 'Sri Sadono',
    desa: 'Setono',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Margo Manunggal',
    namaKelompok: 'Margo Rahayu',
    desa: 'Wakah',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Margo Manunggal',
    namaKelompok: 'Margo Rukun',
    desa: 'Wakah',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Margo Manunggal',
    namaKelompok: 'Gemah Ripah I',
    desa: 'Wakah',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Margo Manunggal',
    namaKelompok: 'Gemah Ripah II',
    desa: 'Wakah',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Margo Manunggal',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Wakah',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Manunggal Karso',
    namaKelompok: 'Arum Dalu',
    desa: 'Tawangrejo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Manunggal Karso',
    namaKelompok: 'Sri Rejeki',
    desa: 'Tawangrejo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Manunggal Karso',
    namaKelompok: 'Sri Sadono',
    desa: 'Tawangrejo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Manunggal Karso',
    namaKelompok: 'Tawang Sari',
    desa: 'Tawangrejo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Suka Mulya',
    namaKelompok: 'Setia Kawan',
    desa: 'Samberejo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Suka Mulya',
    namaKelompok: 'Ngudi Tani',
    desa: 'Samberejo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Suka Mulya',
    namaKelompok: 'Margo Kencono',
    desa: 'Samberejo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Karya Tani',
    desa: 'Manisharjo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Sri Mulih',
    desa: 'Manisharjo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Konco Tani',
    desa: 'Manisharjo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Karya Utama',
    desa: 'Manisharjo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Ngudi Makmur',
    desa: 'Manisharjo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Subur Makmur',
    desa: 'Manisharjo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Tirta Nirwala',
    desa: 'Sidomulyo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Widu Satrio',
    desa: 'Sidomulyo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Sadewo',
    desa: 'Sidomulyo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Nakulo',
    desa: 'Sidomulyo',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Sekar Lawu',
    namaKelompok: 'Ngesti Rejeki',
    desa: 'Ngrambe',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Sekar Lawu',
    namaKelompok: 'Sempulur',
    desa: 'Ngrambe',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Sekar Lawu',
    namaKelompok: 'Ngesti Tani',
    desa: 'Ngrambe',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Sekar Lawu',
    namaKelompok: 'Ngesti Lestari',
    desa: 'Ngrambe',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Sekar Lawu',
    namaKelompok: 'Beran Makmur',
    desa: 'Ngrambe',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ardi Lawu',
    namaKelompok: 'Sri Lestari',
    desa: 'Babadan',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ardi Lawu',
    namaKelompok: 'Sri Widodo',
    desa: 'Babadan',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ardi Lawu',
    namaKelompok: 'Sri Rejeki',
    desa: 'Babadan',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ardi Lawu',
    namaKelompok: 'Mekar Tani',
    desa: 'Babadan',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ardi Lawu',
    namaKelompok: 'Budi Luhur',
    desa: 'Babadan',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Tani',
    namaKelompok: 'Sedyo Makmur',
    desa: 'Krandegan',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Tani',
    namaKelompok: 'Kondang Makmur',
    desa: 'Krandegan',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Tani',
    namaKelompok: 'Jati Lestari',
    desa: 'Krandegan',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Tani',
    namaKelompok: 'Tani Makmur',
    desa: 'Krandegan',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Tani Mulyo',
    desa: 'Pucangan',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Among Tani',
    desa: 'Pucangan',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Mekarsari',
    desa: 'Pucangan',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Sri Rejeki',
    desa: 'Pucangan',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Margo Rejeki',
    desa: 'Pucangan',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Cepoko Mulya',
    namaKelompok: 'Rejeki Tani',
    desa: 'Cepoko',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Cepoko Mulya',
    namaKelompok: 'Dewi Sri I',
    desa: 'Cepoko',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Cepoko Mulya',
    namaKelompok: 'Dewi Sri II',
    desa: 'Cepoko',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Cepoko Mulya',
    namaKelompok: 'Dewi Sri III',
    desa: 'Cepoko',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Cepoko Mulya',
    namaKelompok: 'Margo Mulyo',
    desa: 'Cepoko',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Cepoko Mulya',
    namaKelompok: 'Tani Mulyo',
    desa: 'Cepoko',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Cepoko Mulya',
    namaKelompok: 'Tani Manunggal',
    desa: 'Cepoko',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Mandiro Harjo',
    namaKelompok: 'Rukun Santoso II',
    desa: 'Mendiro',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Mandiro Harjo',
    namaKelompok: 'Rukun Santoso',
    desa: 'Mendiro',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Mandiro Harjo',
    namaKelompok: 'Ngudi Mulyo',
    desa: 'Mendiro',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Mandiro Harjo',
    namaKelompok: 'Suko Raharjo',
    desa: 'Mendiro',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Mandiro Harjo',
    namaKelompok: 'Sedyo Makmur 1',
    desa: 'Mendiro',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Mandiro Harjo',
    namaKelompok: 'Sedyo Makmur 2',
    desa: 'Mendiro',
    kecamatan: 'Ngrambe'
  },
  {
    gapoktan: 'Umbul Mandiri',
    namaKelompok: 'Sendang Kinasih',
    desa: 'Umbulrejo',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Umbul Mandiri',
    namaKelompok: 'Sendang Minulyo',
    desa: 'Umbulrejo',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Pamardisiwi',
    desa: 'Kletekan',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Lawu Subur',
    desa: 'Kletekan',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Ngudi Rahayu',
    desa: 'Kletekan',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Ngudi Utomo',
    desa: 'Kletekan',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Jati Makmur',
    namaKelompok: 'Arum Sari',
    desa: 'Jaten',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Jati Makmur',
    namaKelompok: 'Retno Mekar',
    desa: 'Jaten',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Jati Makmur',
    namaKelompok: 'Margo Tani',
    desa: 'Jaten',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Jati Makmur',
    namaKelompok: 'Citrun Jaya',
    desa: 'Jaten',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Giri Bangkit',
    namaKelompok: 'Rukun Tani',
    desa: 'Girimulyo',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Giri Bangkit',
    namaKelompok: 'Pamardi Tiwi',
    desa: 'Girimulyo',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Giri Bangkit',
    namaKelompok: 'Mulyo Rahayu',
    desa: 'Girimulyo',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Giri Bangkit',
    namaKelompok: 'Sido mulyo',
    desa: 'Girimulyo',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Giri Bangkit',
    namaKelompok: 'Sekar Asih',
    desa: 'Girimulyo',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Budi Kamulyan',
    desa: 'Ngrayudan',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Jamandiri Kencana',
    desa: 'Ngrayudan',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Sri Mulyo',
    desa: 'Ngrayudan',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Sri Widodo',
    desa: 'Ngrayudan',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Garuda Merah',
    namaKelompok: 'Sri Rejeki',
    desa: 'Talang',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Garuda Merah',
    namaKelompok: 'Sri Dadi',
    desa: 'Talang',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Wahyu Risqi',
    namaKelompok: 'Sri Asih',
    desa: 'Macanan',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Wahyu Risqi',
    namaKelompok: 'Pondok Makmur',
    desa: 'Macanan',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Wahyu Risqi',
    namaKelompok: 'Setyo Asih',
    desa: 'Macanan',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Wahyu Risqi',
    namaKelompok: 'Sendang Kamulyan',
    desa: 'Macanan',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Sido Arum',
    namaKelompok: 'Sido Makmur',
    desa: 'Brubuh',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Sido Arum',
    namaKelompok: 'Arum Dina',
    desa: 'Brubuh',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Lawu Mulyo',
    namaKelompok: 'Sido Makmur',
    desa: 'Jogorogo',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Lawu Mulyo',
    namaKelompok: 'Tani Subur',
    desa: 'Jogorogo',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Lawu Mulyo',
    namaKelompok: 'Tani Rahayu',
    desa: 'Jogorogo',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Lawu Mulyo',
    namaKelompok: 'Enggal Makmur',
    desa: 'Jogorogo',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Lawu Mulyo',
    namaKelompok: 'Sendang Makmur',
    desa: 'Jogorogo',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Lawu Mulyo',
    namaKelompok: 'Sekar Makmur',
    desa: 'Jogorogo',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Tani Bersatu',
    namaKelompok: 'Ngudi Mulyo',
    desa: 'Dawung',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Tani Bersatu',
    namaKelompok: 'Ngudi Rejeki',
    desa: 'Dawung',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Tani Bersatu',
    namaKelompok: 'Ngudi Rahayu',
    desa: 'Dawung',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Tani Bersatu',
    namaKelompok: 'Ngudi Santoso',
    desa: 'Dawung',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Sari Jaya',
    namaKelompok: 'Sambi Barat',
    desa: 'Tanjungsari',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Sari Jaya',
    namaKelompok: 'Sumendung',
    desa: 'Tanjungsari',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Sari Jaya',
    namaKelompok: 'Sri Tanjung',
    desa: 'Tanjungsari',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Mulyo Tani',
    namaKelompok: 'Sambi I',
    desa: 'Soco',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Mulyo Tani',
    namaKelompok: 'Sambi II',
    desa: 'Soco',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Mulyo Tani',
    namaKelompok: 'Gondang I',
    desa: 'Soco',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Mulyo Tani',
    namaKelompok: 'Gondang II',
    desa: 'Soco',
    kecamatan: 'Jogorogo'
  },
  {
    gapoktan: 'Mustika Sari',
    namaKelompok: 'Mitro Wono',
    desa: 'Karanggupito',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Mustika Sari',
    namaKelompok: 'Paket',
    desa: 'Karanggupito',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Mustika Sari',
    namaKelompok: 'Wahana Mandiri',
    desa: 'Karanggupito',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Mustika Sari',
    namaKelompok: 'Mardi Tani',
    desa: 'Karanggupito',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Mustika Sari',
    namaKelompok: 'Ngudi Rukun',
    desa: 'Karanggupito',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Mustika Sari',
    namaKelompok: 'Sumber Duren',
    desa: 'Karanggupito',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Rejo Makmur',
    namaKelompok: 'Suko Makmur',
    desa: 'Karangrejo',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Rejo Makmur',
    namaKelompok: 'Sri Rejeki',
    desa: 'Karangrejo',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Rejo Makmur',
    namaKelompok: 'Tani Mulyo',
    desa: 'Karangrejo',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Rejo Makmur',
    namaKelompok: 'Ngudi Rahayu',
    desa: 'Karangrejo',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Rejo Makmur',
    namaKelompok: 'Sedyo Mulyo',
    desa: 'Karangrejo',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Rejo Makmur',
    namaKelompok: 'Tani Makmur',
    desa: 'Karangrejo',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Wira Usaha',
    namaKelompok: 'Dewi Sri',
    desa: 'Simo',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Wira Usaha',
    namaKelompok: 'Wira Tani',
    desa: 'Simo',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Wira Usaha',
    namaKelompok: 'Tentrem Rahayu',
    desa: 'Simo',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Wira Usaha',
    namaKelompok: 'Rukun Mulyo',
    desa: 'Simo',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Tunas Santoso',
    namaKelompok: 'Sidodadi Mulyo',
    desa: 'Ploso',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Tunas Santoso',
    namaKelompok: 'Ngudi Subur',
    desa: 'Ploso',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Tunas Santoso',
    namaKelompok: 'Ngudi Mulyo',
    desa: 'Ploso',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Tunas Santoso',
    namaKelompok: 'Garuda Tani',
    desa: 'Ploso',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Tunas Santoso',
    namaKelompok: 'Tani Subur',
    desa: 'Ploso',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Maju Utomo',
    namaKelompok: 'Ngudi Makmur',
    desa: 'Majasem',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Maju Utomo',
    namaKelompok: 'Ngudi Santoso',
    desa: 'Majasem',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Maju Utomo',
    namaKelompok: 'Bina Tani',
    desa: 'Majasem',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Maju Utomo',
    namaKelompok: 'Ngudi Rahayu',
    desa: 'Majasem',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Maju Utomo',
    namaKelompok: 'Dewi Sri',
    desa: 'Majasem',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Maju Utomo',
    namaKelompok: 'Mitra Tani',
    desa: 'Majasem',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Maju Utomo',
    namaKelompok: 'Ngudi Sari',
    desa: 'Majasem',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Maju Utomo',
    namaKelompok: 'Sri Rejeki',
    desa: 'Majasem',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Maju Utomo',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Majasem',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Maju Utomo',
    namaKelompok: 'Tani Makmur',
    desa: 'Majasem',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Maju Utomo',
    namaKelompok: 'Tani Rahayu',
    desa: 'Majasem',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Maju Utomo',
    namaKelompok: 'Tani Bahagia',
    desa: 'Majasem',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Maju Utomo',
    namaKelompok: 'Wono Makmur',
    desa: 'Majasem',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Maju Utomo',
    namaKelompok: 'Sumber Makmur',
    desa: 'Majasem',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Maju Utomo',
    namaKelompok: 'Tani Rukun',
    desa: 'Majasem',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Setia Karya',
    namaKelompok: 'Sido Muncul',
    desa: 'Kendal',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Setia Karya',
    namaKelompok: 'Tunas Harapan',
    desa: 'Kendal',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Setia Karya',
    namaKelompok: 'Sri Widodo',
    desa: 'Kendal',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Setia Karya',
    namaKelompok: 'Maju Makmur',
    desa: 'Kendal',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Setia Karya',
    namaKelompok: 'Rukun Santoso',
    desa: 'Kendal',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Setia Karya',
    namaKelompok: 'Wahyu Sadoro',
    desa: 'Kendal',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Setia Karya',
    namaKelompok: 'Bangun Trisno',
    desa: 'Kendal',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Setia Karya',
    namaKelompok: 'Wono Makmur',
    desa: 'Kendal',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Setia Karya',
    namaKelompok: 'Jati Luhur',
    desa: 'Kendal',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Sido Laju',
    namaKelompok: 'Wijil Makmur',
    desa: 'Sidorejo',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Sido Laju',
    namaKelompok: 'Giat Mertani',
    desa: 'Sidorejo',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Sido Laju',
    namaKelompok: 'Intan Tani',
    desa: 'Sidorejo',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Sido Laju',
    namaKelompok: 'Sido Makmur',
    desa: 'Sidorejo',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Sido Laju',
    namaKelompok: 'Sri Rejeki',
    desa: 'Sidorejo',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Sido Laju',
    namaKelompok: 'Sri Santoso',
    desa: 'Sidorejo',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Sumber Kencono',
    namaKelompok: 'Sri Luhur II',
    desa: 'Gayam',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Sumber Kencono',
    namaKelompok: 'Sri Sedono',
    desa: 'Gayam',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Sumber Kencono',
    namaKelompok: 'Sri Luwih II',
    desa: 'Gayam',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Sumber Kencono',
    namaKelompok: 'Sri Luwih I',
    desa: 'Gayam',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Rukun Tani',
    desa: 'Dadapan',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Tani Bahagia',
    desa: 'Dadapan',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Marsudi Tani',
    desa: 'Dadapan',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Ngudi Rejeki I',
    desa: 'Dadapan',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Ngudi Rahayu',
    desa: 'Dadapan',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Karya Bakti',
    desa: 'Dadapan',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Tani Semulur',
    desa: 'Dadapan',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Amanah',
    namaKelompok: 'Ngudi Luwih',
    desa: 'Patalan',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Amanah',
    namaKelompok: 'Ngudi Santoso',
    desa: 'Patalan',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Amanah',
    namaKelompok: 'Makmur Sewatu',
    desa: 'Patalan',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Amanah',
    namaKelompok: 'Tani Sejajar I',
    desa: 'Patalan',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Amanah',
    namaKelompok: 'Tani Sejajar II',
    desa: 'Patalan',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Amanah',
    namaKelompok: 'Jeruk Gulung',
    desa: 'Patalan',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Amanah',
    namaKelompok: 'Sepudak Makmur',
    desa: 'Patalan',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Amanah',
    namaKelompok: 'Tani Makmur',
    desa: 'Patalan',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Amanah',
    namaKelompok: 'Makmur Secangkring',
    desa: 'Patalan',
    kecamatan: 'Kendal'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Sido Dadi I',
    desa: 'Keras Wetan',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Sido Dadi II',
    desa: 'Keras Wetan',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Sumber Agung',
    desa: 'Keras Wetan',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Keras Wetan',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Sido Rukun',
    desa: 'Keras Wetan',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Margo Lestari',
    namaKelompok: 'Bogo Tani',
    desa: 'Kenitren',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Margo Lestari',
    namaKelompok: 'Ngegot Tani',
    desa: 'Kenitren',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Margo Lestari',
    namaKelompok: 'Tani Abadi',
    desa: 'Kenitren',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Margo Lestari',
    namaKelompok: 'Tani Murakapi',
    desa: 'Kenitren',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Margo Lestari',
    namaKelompok: 'Mulyo Tani',
    desa: 'Kenitren',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Margo Lestari',
    namaKelompok: 'Rukun Tani Tejo Makmur',
    desa: 'Kenitren',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Sedyo Mulyo',
    namaKelompok: 'Karya Tani',
    desa: 'Tambakromo',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Sedyo Mulyo',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Tambakromo',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Sedyo Mulyo',
    namaKelompok: 'Sumber Karya',
    desa: 'Tambakromo',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Sedyo Mulyo',
    namaKelompok: 'Sumber Makmur',
    desa: 'Tambakromo',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Sri Rejeki',
    desa: 'Tepas',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Sri Rahayu',
    desa: 'Tepas',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Sari Rejeki',
    desa: 'Tepas',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Rukun Tani',
    desa: 'Tepas',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Satria Tani',
    desa: 'Tepas',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Tani Makmur',
    desa: 'Tepas',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Margo Lestari',
    namaKelompok: 'Sejahtera',
    desa: 'Geneng',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Margo Lestari',
    namaKelompok: 'Sri Sedhono',
    desa: 'Geneng',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Margo Lestari',
    namaKelompok: 'Dewi Sri',
    desa: 'Geneng',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Margo Lestari',
    namaKelompok: 'Sido Mulyo',
    desa: 'Geneng',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Margo Lestari',
    namaKelompok: 'Rukun Makmur',
    desa: 'Geneng',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Margo Lestari',
    namaKelompok: 'Margo Tani',
    desa: 'Geneng',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Margo Lestari',
    namaKelompok: 'Sedyo Rukun',
    desa: 'Geneng',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Margo Lestari',
    namaKelompok: 'Tunas Makmur',
    desa: 'Geneng',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Margo Lestari',
    namaKelompok: 'Tani Makmur',
    desa: 'Geneng',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Margo Lestari',
    namaKelompok: 'Karya Makmur',
    desa: 'Geneng',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Tani Murakabi',
    namaKelompok: 'Wonosobo',
    desa: 'Sidorejo',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Tani Murakabi',
    namaKelompok: 'Sido Rukun',
    desa: 'Sidorejo',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Tani Murakabi',
    namaKelompok: 'Mina Makmur',
    desa: 'Sidorejo',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Tani Murakabi',
    namaKelompok: 'Tani Makmur',
    desa: 'Sidorejo',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Tani Murakabi',
    namaKelompok: 'Tani Maju',
    desa: 'Sidorejo',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Sri Rejeki',
    namaKelompok: 'Sri Rejeki',
    desa: 'Baderan',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Sri Rejeki',
    namaKelompok: 'Sri Sedhono',
    desa: 'Baderan',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Sri Rejeki',
    namaKelompok: 'Sri Lestari',
    desa: 'Baderan',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Sri Rejeki',
    namaKelompok: 'Sri Mulyo',
    desa: 'Baderan',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Sri Rejeki',
    namaKelompok: 'Sri Murakapi',
    desa: 'Baderan',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Tani Utomo',
    desa: 'Klampisan',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Tani Rukun',
    desa: 'Klampisan',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Tani Raharjo',
    desa: 'Klampisan',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Tani Mulyo',
    desa: 'Klampisan',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Usaha Bersama',
    namaKelompok: 'Sri Anom',
    desa: 'Kasreman',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Usaha Bersama',
    namaKelompok: 'Sri Sumber',
    desa: 'Kasreman',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Usaha Bersama',
    namaKelompok: 'Sri Tanjung',
    desa: 'Kasreman',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Usaha Bersama',
    namaKelompok: 'Sri Rejeki',
    desa: 'Kasreman',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Usaha Bersama',
    namaKelompok: 'Sri Mulyo',
    desa: 'Kasreman',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Usaha Bersama',
    namaKelompok: 'Sri Lestari',
    desa: 'Kasreman',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Karya Makmur',
    namaKelompok: 'Sumber Tani',
    desa: 'Kersikan',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Karya Makmur',
    namaKelompok: 'Sumber Mulyo',
    desa: 'Kersikan',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Karya Makmur',
    namaKelompok: 'Sumber Purwo',
    desa: 'Kersikan',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Karya Makmur',
    namaKelompok: 'Sumber Padi',
    desa: 'Kersikan',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Karya Makmur',
    namaKelompok: 'Sumber Makmur',
    desa: 'Kersikan',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Dempel Bangkit',
    namaKelompok: 'Sri Gunting',
    desa: 'Dempel',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Dempel Bangkit',
    namaKelompok: 'Hadi Rejeki I',
    desa: 'Dempel',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Dempel Bangkit',
    namaKelompok: 'Hadi Rejeki II',
    desa: 'Dempel',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Dempel Bangkit',
    namaKelompok: 'Nglencong Sari I',
    desa: 'Dempel',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Dempel Bangkit',
    namaKelompok: 'Nglencong Sari II',
    desa: 'Dempel',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Dempel Bangkit',
    namaKelompok: 'Nglencong Sari III',
    desa: 'Dempel',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Subur Manunggal',
    namaKelompok: 'Sedia Rukun',
    desa: 'Klitik',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Subur Manunggal',
    namaKelompok: 'Kadang Tani',
    desa: 'Klitik',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Subur Manunggal',
    namaKelompok: 'Rukun Santoso',
    desa: 'Klitik',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Subur Manunggal',
    namaKelompok: 'Klitik Sari',
    desa: 'Klitik',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Subur Manunggal',
    namaKelompok: 'Mitra Tani',
    desa: 'Klitik',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Subur Manunggal',
    namaKelompok: 'Sambir Tani',
    desa: 'Klitik',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Subur Manunggal',
    namaKelompok: 'Sri Sedono',
    desa: 'Klitik',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Mulyo Tani',
    namaKelompok: 'Galuh Tani',
    desa: 'Kersoharjo',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Mulyo Tani',
    namaKelompok: 'Bandung Tani',
    desa: 'Kersoharjo',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Mulyo Tani',
    namaKelompok: 'Kerso Tani I',
    desa: 'Kersoharjo',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Mulyo Tani',
    namaKelompok: 'Kerso Tani II',
    desa: 'Kersoharjo',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Mulyo Tani',
    namaKelompok: 'Bangun Tani',
    desa: 'Kersoharjo',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Mulyo Tani',
    namaKelompok: 'Tani Unggul',
    desa: 'Kersoharjo',
    kecamatan: 'Geneng'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Pelita Maju',
    desa: 'Randusongo',
    kecamatan: 'Gerih'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Lestari',
    desa: 'Randusongo',
    kecamatan: 'Gerih'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Randusongo',
    desa: 'Randusongo',
    kecamatan: 'Gerih'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Widodo',
    desa: 'Randusongo',
    kecamatan: 'Gerih'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Santoso',
    desa: 'Randusongo',
    kecamatan: 'Gerih'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Dewi Sinto',
    desa: 'Randusongo',
    kecamatan: 'Gerih'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Dewi Sri',
    desa: 'Randusongo',
    kecamatan: 'Gerih'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Harapan',
    desa: 'Randusongo',
    kecamatan: 'Gerih'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Widodaren',
    desa: 'Widodaren',
    kecamatan: 'Gerih'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Widya Tani',
    desa: 'Widodaren',
    kecamatan: 'Gerih'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Gelora Masa',
    desa: 'Widodaren',
    kecamatan: 'Gerih'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Sri Rahayu',
    desa: 'Widodaren',
    kecamatan: 'Gerih'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Purnama Tani',
    desa: 'Widodaren',
    kecamatan: 'Gerih'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Ngesti Rahayu',
    desa: 'Widodaren',
    kecamatan: 'Gerih'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Loh Jinawi',
    desa: 'Widodaren',
    kecamatan: 'Gerih'
  },
  {
    gapoktan: 'Mekar Sari',
    namaKelompok: 'Tani Jaya',
    desa: 'Simo',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Mekar Sari',
    namaKelompok: 'Tani Agung',
    desa: 'Simo',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Mekar Sari',
    namaKelompok: 'Tani makmur',
    desa: 'Simo',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Mekar Sari',
    namaKelompok: 'Sri Kembang',
    desa: 'Simo',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Rukun Rahayu',
    namaKelompok: 'Rukun Widodo',
    desa: 'Sumengko',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Rukun Rahayu',
    namaKelompok: 'Rukun Makmur',
    desa: 'Sumengko',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Rukun Rahayu',
    namaKelompok: 'Wiro Tani',
    desa: 'Sumengko',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Tirak Tani',
    desa: 'Tirak',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Tani Rahayu',
    desa: 'Tirak',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Sri Lestari',
    desa: 'Tirak',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Madyo Tani',
    desa: 'Tirak',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Sejahtera',
    namaKelompok: 'Sri Mulyo',
    desa: 'Purwosari',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Sejahtera',
    namaKelompok: 'Tani Makmur',
    desa: 'Purwosari',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Sejahtera',
    namaKelompok: 'Sri Sedono',
    desa: 'Purwosari',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Sejahtera',
    namaKelompok: 'Sri Makmur',
    desa: 'Purwosari',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Utomo',
    namaKelompok: 'Sri Widodo',
    desa: 'Jenangan',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Utomo',
    namaKelompok: 'Sri Rahayu',
    desa: 'Jenangan',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Utomo',
    namaKelompok: 'Sri Utomo',
    desa: 'Jenangan',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Baroka',
    namaKelompok: 'Sido Mulyo',
    desa: 'Pojok',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Baroka',
    namaKelompok: 'Mitra Tani',
    desa: 'Pojok',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Baroka',
    namaKelompok: 'Tani Santoso',
    desa: 'Pojok',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Murakapi',
    namaKelompok: 'Dewi Sri',
    desa: 'Dinden',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Murakapi',
    namaKelompok: 'Tani Mulyo',
    desa: 'Dinden',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Murakapi',
    namaKelompok: 'Taruna Bakti',
    desa: 'Dinden',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Pandan Arum',
    namaKelompok: 'Sri Santoso',
    desa: 'Kendung',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Pandan Arum',
    namaKelompok: 'Sri Muncul',
    desa: 'Kendung',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Pandan Arum',
    namaKelompok: 'Tani Raharjo',
    desa: 'Kendung',
    kecamatan: 'Kwadungan'
  },
  {
    gapoktan: 'Gandri Makmur',
    namaKelompok: 'Sri Rejeki',
    desa: 'Gandri',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Gandri Makmur',
    namaKelompok: 'Mulyaning Bebrayan.',
    desa: 'Gandri',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Gandri Makmur',
    namaKelompok: 'Mugi Rahayu',
    desa: 'Gandri',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Gandri Makmur',
    namaKelompok: 'Jati Makmur',
    desa: 'Gandri',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Gandri Makmur',
    namaKelompok: 'Mangun Karyo',
    desa: 'Gandri',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Sumber Makmur',
    namaKelompok: 'Sumber Tani',
    desa: 'Sumber',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Sumber Makmur',
    namaKelompok: 'Sumber Mulyo',
    desa: 'Sumber',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Sumber Makmur',
    namaKelompok: 'Sumber Agung',
    desa: 'Sumber',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Ngudi Barokah',
    namaKelompok: 'Budi Karya',
    desa: 'Babadan',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Ngudi Barokah',
    namaKelompok: 'Nganti Makmur',
    desa: 'Babadan',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Ngudi Barokah',
    namaKelompok: 'Ngudi Kamulyan',
    desa: 'Babadan',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Ngudi Barokah',
    namaKelompok: 'Sri Mulyo',
    desa: 'Babadan',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Ngudi Barokah',
    namaKelompok: 'Muji Rahayu',
    desa: 'Babadan',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Ngudi Barokah',
    namaKelompok: 'Tani Bahagia',
    desa: 'Babadan',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Ngudi Barokah',
    namaKelompok: 'Margo Mulyo',
    desa: 'Babadan',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Krida Tani',
    namaKelompok: 'Krida Jaya',
    desa: 'Pohkonyal',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Krida Tani',
    namaKelompok: 'Sempulur',
    desa: 'Pohkonyal',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Krida Tani',
    namaKelompok: 'Tani Makmur',
    desa: 'Pohkonyal',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Krida Tani',
    namaKelompok: 'Gemah Ripah',
    desa: 'Pohkonyal',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Rahayu',
    desa: 'Paras',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Dewi Murni',
    desa: 'Paras',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Dewi Sri',
    desa: 'Paras',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Sri Rejeki',
    namaKelompok: 'Rukun Jaya',
    desa: 'Pleset',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Sri Rejeki',
    namaKelompok: 'Agung Tani',
    desa: 'Pleset',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Sri Rejeki',
    namaKelompok: 'Timbul Karya',
    desa: 'Pleset',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Sri Rejeki',
    namaKelompok: 'Timbul Jaya',
    desa: 'Pleset',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Sri Rejeki',
    namaKelompok: 'Karya Tani',
    desa: 'Pleset',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Marsudi Tani',
    namaKelompok: 'Sumber Makmur',
    desa: 'Pangkur',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Marsudi Tani',
    namaKelompok: 'Raharjo',
    desa: 'Pangkur',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Marsudi Tani',
    namaKelompok: 'Tani Makmur',
    desa: 'Pangkur',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Marsudi Tani',
    namaKelompok: 'Tani Mulyo',
    desa: 'Pangkur',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Marsudi Tani',
    namaKelompok: 'Angesti Rahayu',
    desa: 'Pangkur',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Marsudi Tani',
    namaKelompok: 'Rukun Tani',
    desa: 'Pangkur',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Ngudi Barokah',
    namaKelompok: 'Waruk Tani',
    desa: 'Waruk Tengah',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Ngudi Barokah',
    namaKelompok: 'Sumber Tani',
    desa: 'Waruk Tengah',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Ngudi Barokah',
    namaKelompok: 'Margo rejo',
    desa: 'Waruk Tengah',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Tri Langgeng',
    namaKelompok: 'Moro Seneng',
    desa: 'Ngompro',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Tri Langgeng',
    namaKelompok: 'Rukun Jaya',
    desa: 'Ngompro',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Tri Langgeng',
    namaKelompok: 'Sido Langgeng',
    desa: 'Ngompro',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Tri Langgeng',
    namaKelompok: 'Tunggal Roso',
    desa: 'Ngompro',
    kecamatan: 'Pangkur'
  },
  {
    gapoktan: 'Manunggal',
    namaKelompok: 'Sri Lestari',
    desa: 'Campur Sari',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Manunggal',
    namaKelompok: 'Sri Rahayu',
    desa: 'Campur Sari',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Manunggal',
    namaKelompok: 'Sri Mukti',
    desa: 'Campur Sari',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Manunggal',
    namaKelompok: 'Al Muttaqin',
    desa: 'Campur Sari',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Manunggal',
    namaKelompok: 'Sri Sedono',
    desa: 'Campur Sari',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Tani Moderen',
    namaKelompok: 'Sri Rejeki',
    desa: 'Danguk',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Tani Moderen',
    namaKelompok: 'Ngudi Rahayu',
    desa: 'Danguk',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Tani Moderen',
    namaKelompok: 'Tani Makmur',
    desa: 'Danguk',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Tani Bahagia',
    namaKelompok: 'Rukun Makmur',
    desa: 'Gempol',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Tani Bahagia',
    namaKelompok: 'Rukun Abadi',
    desa: 'Gempol',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Tani Bahagia',
    namaKelompok: 'Rukun Widodo',
    desa: 'Gempol',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Tani Bahagia',
    namaKelompok: 'Rukun Santoso',
    desa: 'Gempol',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Anom Tani',
    namaKelompok: 'Sumber Bakat',
    desa: 'Ringin Anom',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Anom Tani',
    namaKelompok: 'Marsudi Tani',
    desa: 'Ringin Anom',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Anom Tani',
    namaKelompok: 'Sri Lestari',
    desa: 'Ringin Anom',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Makmur',
    namaKelompok: 'Guyup Rukun',
    desa: 'Sembung',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Makmur',
    namaKelompok: 'Tulodho',
    desa: 'Sembung',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Makmur',
    namaKelompok: 'Rahayu',
    desa: 'Sembung',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Makmur',
    namaKelompok: 'Utomo',
    desa: 'Sembung',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Sri Tani',
    desa: 'Sidorejo',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Rukun Tani',
    desa: 'Sidorejo',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Rukun Makmur',
    desa: 'Sidorejo',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Margo Mulyo',
    desa: 'Sidorejo',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Rukun Mulyo',
    desa: 'Sidorejo',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Rukun Jaya',
    namaKelompok: 'Sri Mulyo',
    desa: 'Dungmiri',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Rukun Jaya',
    namaKelompok: 'Klanding Tani',
    desa: 'Dungmiri',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Rukun Jaya',
    namaKelompok: 'Sri Eko Karyo',
    desa: 'Dungmiri',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sido Mukti',
    namaKelompok: 'Sri Makmur',
    desa: 'Brangol',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sido Mukti',
    namaKelompok: 'Tulodho',
    desa: 'Brangol',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sinar Prima',
    namaKelompok: 'Tani Mulyo',
    desa: 'Sidokerto',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sinar Prima',
    namaKelompok: 'Mugo Lestari',
    desa: 'Sidokerto',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sinar Prima',
    namaKelompok: 'Sidodadi',
    desa: 'Sidokerto',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sinar Prima',
    namaKelompok: 'Sri Jaya I',
    desa: 'Sidokerto',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sinar Prima',
    namaKelompok: 'Sri Jaya II',
    desa: 'Sidokerto',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Jati Karya',
    namaKelompok: 'Mardi Tani I',
    desa: 'Jatipuro',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Jati Karya',
    namaKelompok: 'Mardi Tani II',
    desa: 'Jatipuro',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Jati Karya',
    namaKelompok: 'Tani Mulyo',
    desa: 'Jatipuro',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Jati Karya',
    namaKelompok: 'Baron Makmur',
    desa: 'Jatipuro',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Tani Mulyo',
    desa: 'Puhti',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Marsudi Utomo',
    desa: 'Puhti',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Tani Madyo',
    desa: 'Puhti',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Karya Makmur',
    namaKelompok: 'Arto Moro',
    desa: 'Sawo',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Karya Makmur',
    namaKelompok: 'Tani Subur',
    desa: 'Sawo',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Karya Makmur',
    namaKelompok: 'Tani Makmur',
    desa: 'Sawo',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Ngudi Utomo',
    desa: 'Karangjati',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Ngudi Rahayu',
    desa: 'Karangjati',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Marsudi Karyo',
    desa: 'Karangjati',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Margo Tani I',
    desa: 'Karangjati',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Margo Tani II',
    desa: 'Karangjati',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Tani Manunggal',
    desa: 'Legundi',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Tani Makmur',
    desa: 'Legundi',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Tani Maju',
    desa: 'Legundi',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Tani Mulyo',
    desa: 'Legundi',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Tani Mandiri',
    desa: 'Legundi',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Makaryo',
    desa: 'Legundi',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sumber Mulyo',
    namaKelompok: 'Rukun Tani I',
    desa: 'Rejomulyo',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sumber Mulyo',
    namaKelompok: 'Rukun Tani II',
    desa: 'Rejomulyo',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sumber Mulyo',
    namaKelompok: 'Rukun Tani III',
    desa: 'Rejomulyo',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sumber Mulyo',
    namaKelompok: 'Sido Makmur I',
    desa: 'Rejomulyo',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sumber Mulyo',
    namaKelompok: 'Sido Makmur II',
    desa: 'Rejomulyo',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sapta Manunggal',
    namaKelompok: 'Among Tani I',
    desa: 'Rejuno',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sapta Manunggal',
    namaKelompok: 'Among Tani II',
    desa: 'Rejuno',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sapta Manunggal',
    namaKelompok: 'Among Tani III',
    desa: 'Rejuno',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sapta Manunggal',
    namaKelompok: 'Among Tani IV',
    desa: 'Rejuno',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sapta Manunggal',
    namaKelompok: 'Among Tani V',
    desa: 'Rejuno',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sapta Manunggal',
    namaKelompok: 'Among Tani VI',
    desa: 'Rejuno',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Sapta Manunggal',
    namaKelompok: 'Among Tani VII',
    desa: 'Rejuno',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Jaya Makmur',
    namaKelompok: 'Mekar Tani',
    desa: 'Ploso Lor',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Jaya Makmur',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Ploso Lor',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Jaya Makmur',
    namaKelompok: 'Tani Jaya',
    desa: 'Ploso Lor',
    kecamatan: 'Karangjati'
  },
  {
    gapoktan: 'Tani Asih',
    namaKelompok: 'Sri Lestari 1',
    desa: 'Lego Wetan',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Tani Asih',
    namaKelompok: 'Sri Lestari II',
    desa: 'Lego Wetan',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Tani Asih',
    namaKelompok: 'Tani Mulyo',
    desa: 'Lego Wetan',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Tani Asih',
    namaKelompok: 'Bumi Lestari',
    desa: 'Lego Wetan',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sumber Makmur',
    namaKelompok: 'Tani Mulyo',
    desa: 'Dero',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sumber Makmur',
    namaKelompok: 'Murni',
    desa: 'Dero',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sumber Makmur',
    namaKelompok: 'Rukun Makmur',
    desa: 'Dero',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sumber Makmur',
    namaKelompok: 'Unggul Mulyo',
    desa: 'Dero',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sumber Makmur',
    namaKelompok: 'Sumber Abadi',
    desa: 'Dero',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Sri Rahayu',
    desa: 'Krompol',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Tani Manunggal',
    desa: 'Krompol',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Rukun Mulyo',
    desa: 'Krompol',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Satrio Mulyo',
    desa: 'Krompol',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Maju Makmur',
    desa: 'Krompol',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Mitra Panca Tani',
    namaKelompok: 'Sinar Tani',
    desa: 'Mojo',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Mitra Panca Tani',
    namaKelompok: 'Rukun Makmur',
    desa: 'Mojo',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Mitra Panca Tani',
    namaKelompok: 'Cahaya Tani',
    desa: 'Mojo',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Mitra Panca Tani',
    namaKelompok: 'Sari Tani',
    desa: 'Mojo',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Mitra Panca Tani',
    namaKelompok: 'Kusuma Tani',
    desa: 'Mojo',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Sumber Tani',
    desa: 'Sumberbening',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Karya Tani',
    desa: 'Sumberbening',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Sido Tani I',
    desa: 'Sumberbening',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Sido Tani II',
    desa: 'Sumberhening',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Tani Mulyo I',
    desa: 'Sumberbening',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Tani Mulyo II',
    desa: 'Sumberbening',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Budi Karomah',
    desa: 'Sumberbening',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Karya Makmur',
    desa: 'Sumberbening',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Sri Lestari',
    desa: 'Sumberbening',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Subur',
    desa: 'Sumberbening',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Ngremboko Ngudi Mulyo',
    namaKelompok: 'Ngremboko',
    desa: 'Bringin',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Ngremboko Ngudi Mulyo',
    namaKelompok: 'Ngudi Luhur',
    desa: 'Bringin',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Ngremboko Ngudi Mulyo',
    namaKelompok: 'Tani Mulyo',
    desa: 'Bringin',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Dampit Manunggal',
    namaKelompok: 'Ngudi Raharjo',
    desa: 'Dampit',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Dampit Manunggal',
    namaKelompok: 'Ngudi Karya',
    desa: 'Dampit',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Dampit Manunggal',
    namaKelompok: 'Rukun Tani',
    desa: 'Dampit',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Tirto Mulyo',
    namaKelompok: 'Karya Tani',
    desa: 'Suruh',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Tirto Mulyo',
    namaKelompok: 'Rukun Makmur',
    desa: 'Suruh',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Manunggal Karya',
    namaKelompok: 'Gawerejo',
    desa: 'Gandong',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Manunggal Karya',
    namaKelompok: 'Suko Makmur',
    desa: 'Gandong',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Manunggal Karya',
    namaKelompok: 'Sri Rejeki',
    desa: 'Gandong',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Manunggal Karya',
    namaKelompok: 'Gemah Ripah',
    desa: 'Gandong',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Manunggal Karya',
    namaKelompok: 'Lohjinawi',
    desa: 'Gandong',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Manunggal Karya',
    namaKelompok: 'Sidomulyo',
    desa: 'Gandong',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sermu Tani',
    namaKelompok: 'Setyo Tani',
    desa: 'Kenongrejo',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sermu Tani',
    namaKelompok: 'Kenongo Mulyo',
    desa: 'Kenongrejo',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sermu Tani',
    namaKelompok: 'Sri Mulyo',
    desa: 'Kenongrejo',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sermu Tani',
    namaKelompok: 'Sari Tani',
    desa: 'Kenongrejo',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sermu Tani',
    namaKelompok: 'Sri Rejeki I',
    desa: 'Kenongrejo',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sermu Tani',
    namaKelompok: 'Sri Murakabi I',
    desa: 'Kenongrejo',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sermu Tani',
    namaKelompok: 'Maju Makmur',
    desa: 'Kenongrejo',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sermu Tani',
    namaKelompok: 'Sri Murakabi II',
    desa: 'Kenongrejo',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Sermu Tani',
    namaKelompok: 'Sri Rejeki II',
    desa: 'Kenongrejo',
    kecamatan: 'Bringin'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Ngudi Makmur',
    desa: 'Banjaransari',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Sri Makmur',
    desa: 'Banjaransari',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Ngudi Mulyo',
    desa: 'Banjaransari',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Tani Mukti',
    desa: 'Banjaransari',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Tani Makmur',
    desa: 'Banjaransari',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Tani Rejeki',
    desa: 'Banjaransari',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Rukun Jaya',
    namaKelompok: 'Tani Karya',
    desa: 'Bendo',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Rukun Jaya',
    namaKelompok: 'Rukun Tani',
    desa: 'Bendo',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Rukun Jaya',
    namaKelompok: 'Tani Makmur',
    desa: 'Bendo',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Rukun Jaya',
    namaKelompok: 'Karya Tani',
    desa: 'Bendo',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Rukun Jaya',
    namaKelompok: 'Jaya Tani',
    desa: 'Bendo',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Harapan Massa',
    namaKelompok: 'Sido Dadi',
    desa: 'Tambakromo',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Harapan Massa',
    namaKelompok: 'Tani Makmur',
    desa: 'Tambakromo',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Harapan Massa',
    namaKelompok: 'Kawan Tani',
    desa: 'Tambakromo',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Harapan Massa',
    namaKelompok: 'Tani Agung',
    desa: 'Tambakromo',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Rukun Rahayu',
    namaKelompok: 'Rukun Makmur',
    desa: 'Tungkulrejo',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Rukun Rahayu',
    namaKelompok: 'Rukun Mulyo',
    desa: 'Tungkulrejo',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Rukun Rahayu',
    namaKelompok: 'Rukun Lestari',
    desa: 'Tungkulrejo',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Margo Utomo',
    namaKelompok: 'Sido Makmur',
    desa: 'Bintoyo',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Margo Utomo',
    namaKelompok: 'Sido Mukti',
    desa: 'Bintoyo',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Margo Utomo',
    namaKelompok: 'Sido Subur',
    desa: 'Bintoyo',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Sri Makmur',
    desa: 'Sukowiyono',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Sri Bangun',
    desa: 'Sukowiyono',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Sri Mulyo',
    desa: 'Sukowiyono',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Sri Subur',
    desa: 'Sukowiyono',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Sri Agung',
    desa: 'Sukowiyono',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Tani Mumpuni',
    desa: 'Munggut',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Tani Mulyo',
    desa: 'Munggut',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Tani Rejeki',
    desa: 'Munggut',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Setya Tani',
    desa: 'Munggut',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Tani Utomo',
    desa: 'Munggut',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Tani Luhur',
    desa: 'Munggut',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Manoto Tani',
    desa: 'Pacing',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Karya Tani',
    desa: 'Pacing',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Pacing',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Tani Makmur',
    desa: 'Pacing',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Tani Mulyo',
    desa: 'Padas',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Tani Jaya',
    desa: 'Padas',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Tani Harta',
    desa: 'Padas',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Mandiri',
    namaKelompok: 'Krido Tani',
    desa: 'Kedungprahu',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Mandiri',
    namaKelompok: 'Mendalan Baru',
    desa: 'Kedungprahu',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Mandiri',
    namaKelompok: 'Tani Subur',
    desa: 'Kedungprahu',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Mandiri',
    namaKelompok: 'Sumber Makmur',
    desa: 'Kedungprahu',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Mandiri',
    namaKelompok: 'Tani Mulyo',
    desa: 'Kedungprahu',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Mandiri',
    namaKelompok: 'Ngesti Rahayu',
    desa: 'Kedungprahu',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Mandiri',
    namaKelompok: 'Remaja Makmur',
    desa: 'Kedungprahu',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Tani Mandiri',
    namaKelompok: 'Karya Tani',
    desa: 'Kedungprahu',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Sambodo',
    namaKelompok: 'Tani Makmur',
    desa: 'Sambiroto',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Sambodo',
    namaKelompok: 'Ngudi Makmur',
    desa: 'Sambiroto',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Sambodo',
    namaKelompok: 'Rukun Santoso',
    desa: 'Sambiroto',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Sambodo',
    namaKelompok: 'Melati',
    desa: 'Sambiroto',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Ngudi Raharjo',
    namaKelompok: 'Sumber Tani I',
    desa: 'Kwadungan Lor',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Ngudi Raharjo',
    namaKelompok: 'Sumber Tani II',
    desa: 'Kwadungan Lor',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Ngudi Raharjo',
    namaKelompok: 'Tani Subur',
    desa: 'Kwadungan Lor',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Ngudi Raharjo',
    namaKelompok: 'Dewi Sri',
    desa: 'Kwadungan Lor',
    kecamatan: 'Padas'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Ngesti Sari',
    desa: 'Jatirejo',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Kunang Jati',
    desa: 'Jatirejo',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Puspo Warno',
    desa: 'Jatirejo',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Sri Mulyo',
    desa: 'Jatirejo',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Jati Sari',
    desa: 'Jatirejo',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Sumber Tani',
    desa: 'Cangakan',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Tani Makmur',
    desa: 'Cangakan',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Tani Subur',
    desa: 'Cangakan',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Pamardi Siwi',
    desa: 'Cangakan',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Marsudi Tani',
    desa: 'Cangakan',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Rejeki Agung',
    namaKelompok: 'Sri Sedono',
    desa: 'Karangmalang',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Rejeki Agung',
    namaKelompok: 'Karang Tani',
    desa: 'Karangmalang',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Rejeki Agung',
    namaKelompok: 'Tani Luhur',
    desa: 'Karangmalang',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Rejeki Agung',
    namaKelompok: 'Karya Tani',
    desa: 'Karangmalang',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Rejeki Agung',
    namaKelompok: 'Sri Rejeki',
    desa: 'Karangmalang',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Agung',
    namaKelompok: 'Tani Mulyo',
    desa: 'Kasreman',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Agung',
    namaKelompok: 'Tani Makmur',
    desa: 'Kasreman',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Agung',
    namaKelompok: 'Tani Murni',
    desa: 'Kasreman',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Agung',
    namaKelompok: 'Pucung Tani',
    desa: 'Kasreman',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Agung',
    namaKelompok: 'Tarub Tani',
    desa: 'Kasreman',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Lancar',
    namaKelompok: 'Sri Rejeki',
    desa: 'Lego Kulon',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Lancar',
    namaKelompok: 'Sumber Makmur',
    desa: 'Lego Kulon',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Lancar',
    namaKelompok: 'Gondang Sri',
    desa: 'Lego Kulon',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Lancar',
    namaKelompok: 'Selo Sri',
    desa: 'Lego Kulon',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Karya Remaja',
    desa: 'Tawun',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Panorama',
    desa: 'Tawun',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Mekarsari',
    desa: 'Tawun',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Tawun III',
    desa: 'Tawun',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Tani Subur',
    desa: 'Tawun',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Sri Widodo',
    desa: 'Tawun',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Karya Asih',
    desa: 'Tawun',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Sidodadi',
    desa: 'Tawun',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Mulyo Tani',
    namaKelompok: 'Subur Makmur',
    desa: 'Kiyonten',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Mulyo Tani',
    namaKelompok: 'Pondok Tani',
    desa: 'Kiyonten',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Mulyo Tani',
    namaKelompok: 'Karya Tani',
    desa: 'Kiyonten',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Mulyo Tani',
    namaKelompok: 'Sri Rahayu',
    desa: 'Kiyonten',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Suka Maju',
    desa: 'Gunungsari',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Rejeki Tani',
    desa: 'Gunungsari',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Tani Makmur I',
    desa: 'Gunungsari',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Tani Makmur II',
    desa: 'Gunungsari',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Tani Subur',
    desa: 'Gunungsari',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Tani Mulyo',
    desa: 'Gunungsari',
    kecamatan: 'Kasreman'
  },
  {
    gapoktan: 'Mangun Tani',
    namaKelompok: 'Nuju Makmur I',
    desa: 'Mangunharjo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mangun Tani',
    namaKelompok: 'Nuju Makmur II',
    desa: 'Mangunharjo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mangun Tani',
    namaKelompok: 'Karya Bakti I',
    desa: 'Mangunharjo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mangun Tani',
    namaKelompok: 'Karya Bakti II',
    desa: 'Mangunharjo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mangun Tani',
    namaKelompok: 'Karya Bakti III',
    desa: 'Mangunharjo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mangun Tani',
    namaKelompok: 'Sri Among Tani',
    desa: 'Mangunharjo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mangun Tani',
    namaKelompok: 'Sri Among Tani II',
    desa: 'Mangunharjo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mangun Tani',
    namaKelompok: 'Kardi Mulyo I',
    desa: 'Mangunharjo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mangun Tani',
    namaKelompok: 'Kardi Mulyo II',
    desa: 'Mangunharjo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mangun Tani',
    namaKelompok: 'Kardi Mulyo III',
    desa: 'Mangunharjo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mangun Tani',
    namaKelompok: 'Nuju Mulyo',
    desa: 'Mangunharjo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mangun Tani',
    namaKelompok: 'Nuju Adil',
    desa: 'Mangunharjo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Sri Lestari',
    desa: 'Kandangan',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Sri Lestari II',
    desa: 'Kandangan',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Ngudi Rahayu I',
    desa: 'Kandangan',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Ngudi Rahayu 2',
    desa: 'Kandangan',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Sri Mulyo',
    desa: 'Kandangan',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Sido Makmur',
    desa: 'Kandangan',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Sido Makmur II',
    desa: 'Kandangan',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Karang Tani',
    desa: 'Kandangan',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Karang Makmur',
    desa: 'Kandangan',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Rukun Tani',
    desa: 'Kartoharjo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Rukun Tani II',
    desa: 'Kartoharjo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Among Tani',
    desa: 'Kartoharjo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Pangkur Sari',
    desa: 'Kartoharjo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Asih',
    namaKelompok: 'Sri Tani',
    desa: 'Beran',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Asih',
    namaKelompok: 'Tani Lestari',
    desa: 'Beran',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Asih',
    namaKelompok: 'Ingasrejo I',
    desa: 'Beran',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Asih',
    namaKelompok: 'Ingasrejo II',
    desa: 'Beran',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Asih',
    namaKelompok: 'Berkah Tani',
    desa: 'Beran',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Asih',
    namaKelompok: 'Sumber Makmur',
    desa: 'Beran',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Asih',
    namaKelompok: 'Tani Mujur',
    desa: 'Beran',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mekarsari',
    namaKelompok: 'Sarirejo',
    desa: 'Jururejo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mekarsari',
    namaKelompok: 'Among Tani',
    desa: 'Jururejo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mekarsari',
    namaKelompok: 'Madyoasri',
    desa: 'Jururejo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mekarsari',
    namaKelompok: 'Sri Rejeki I',
    desa: 'Jururejo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mekarsari',
    namaKelompok: 'Sri Rejeki II',
    desa: 'Jururejo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Waras',
    namaKelompok: 'Setyo Bhakti',
    desa: 'Watualang',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Waras',
    namaKelompok: 'Sumber Makmur',
    desa: 'Watualang',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Waras',
    namaKelompok: 'Setyo Bogo',
    desa: 'Watualang',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Waras',
    namaKelompok: 'Setyo Budi',
    desa: 'Watualang',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Waras',
    namaKelompok: 'Setyo Bumi',
    desa: 'Watualang',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Waras',
    namaKelompok: 'Sumber Asih',
    desa: 'Watualang',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Waras',
    namaKelompok: 'Madyo Asri',
    desa: 'Watualang',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Waras',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Watualang',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Tani Waras',
    namaKelompok: 'Tani Mulyo',
    desa: 'Watualang',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Undosari',
    namaKelompok: 'Sumber Makmur',
    desa: 'Grudo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Undosari',
    namaKelompok: 'Tani Mulyo',
    desa: 'Grudo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Undosari',
    namaKelompok: 'Karya Tani',
    desa: 'Grudo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Undosari',
    namaKelompok: 'Tani Makmur I',
    desa: 'Grudo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Undosari',
    namaKelompok: 'Tani Makmur II',
    desa: 'Grudo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Undosari',
    namaKelompok: 'Bolo Karya Tani',
    desa: 'Grudo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mulia Sejahtera',
    namaKelompok: 'Mulia Sejahtera',
    desa: 'Margomulyo',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mulyo Asri',
    namaKelompok: 'Sri Asih',
    desa: 'Karang Asri',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mulyo Asri',
    namaKelompok: 'Jaya Asri',
    desa: 'Karang Asri',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Mulyo Asri',
    namaKelompok: 'Tani Soko',
    desa: 'Karang Asri',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Sri Mulyo',
    namaKelompok: 'Kadang Tani',
    desa: 'Ngawi',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Sri Mulyo',
    namaKelompok: 'Sri Lestari',
    desa: 'Ngawi',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Sri Mulyo',
    namaKelompok: 'Sri Rahayu',
    desa: 'Ngawi',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Sri Rejeki',
    desa: 'Krt. Prandon',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Ngudi Rahayu',
    desa: 'Krt. Prandon',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Tani Makmur',
    desa: 'Krt. Prandon',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Rukun Tani',
    desa: 'Krt. Prandon',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Ngudi Mulyo',
    desa: 'Krt. Prandon',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Tani Mulyo',
    desa: 'Krt. Prandon',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Krt. Prandon',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Guyup Rukun',
    desa: 'Krt. Prandon',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Makmur Abadi',
    namaKelompok: 'Tani Karya',
    desa: 'Banyuurip',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Makmur Abadi',
    namaKelompok: 'Sido Makmur',
    desa: 'Banyuurip',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Makmur Abadi',
    namaKelompok: 'Karang Tani',
    desa: 'Banyuurip',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Jati Mulyo',
    namaKelompok: 'Ngudi Mulyo',
    desa: 'Kerek',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Jati Mulyo',
    namaKelompok: 'Ngudi Rahayu',
    desa: 'Kerek',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Jati Mulyo',
    namaKelompok: 'Maju Karya',
    desa: 'Kerek',
    kecamatan: 'Ngawi Kota'
  },
  {
    gapoktan: 'Margo Tani',
    namaKelompok: 'Sri Bumi',
    desa: 'Gentong',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Margo Tani',
    namaKelompok: 'Sido Makmur',
    desa: 'Gentong',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Margo Tani',
    namaKelompok: 'Sri Rahayu',
    desa: 'Gentong',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Margo Tani',
    namaKelompok: 'Sempulur',
    desa: 'Gentong',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Margo Tani',
    namaKelompok: 'Sae',
    desa: 'Gentong',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Margo Tani',
    namaKelompok: 'Sri Katon',
    desa: 'Gentong',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Tani Makmur',
    desa: 'Babadan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Sri Sedono',
    desa: 'Babadan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Wiro Bumi',
    desa: 'Babadan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Murni',
    desa: 'Babadan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Sri Rejeki',
    desa: 'Babadan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Kedung Tani',
    namaKelompok: 'Mekar Sari',
    desa: 'Kedungputri',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Kedung Tani',
    namaKelompok: 'Rahayu',
    desa: 'Kedungputri',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Kedung Tani',
    namaKelompok: 'Kenongo',
    desa: 'Kedungputri',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Kedung Tani',
    namaKelompok: 'Tani Makmur',
    desa: 'Kedungputri',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Kedung Tani',
    namaKelompok: 'Karya Tani',
    desa: 'Kedungputri',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Kedung Tani',
    namaKelompok: 'Sinar Tani',
    desa: 'Kedungputri',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Kedung Tani',
    namaKelompok: 'Mawar',
    desa: 'Kedungputri',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Kedung Tani',
    namaKelompok: 'Margo Mulyo',
    desa: 'Kedungputri',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Tani Rahayu',
    namaKelompok: 'Sri Rejeki',
    desa: 'Semen',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Tani Rahayu',
    namaKelompok: 'Lestari',
    desa: 'Semen',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Tani Rahayu',
    namaKelompok: 'Mulyo Tani',
    desa: 'Semen',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Tani Rahayu',
    namaKelompok: 'Sri Mulyo',
    desa: 'Semen',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Tani Rahayu',
    namaKelompok: 'Rukun Tani',
    desa: 'Semen',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Tani Rahayu',
    namaKelompok: 'Karya Tani',
    desa: 'Semen',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Teguh Tani',
    namaKelompok: 'Sido Rukun',
    desa: 'Teguhan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Teguh Tani',
    namaKelompok: 'Mardi Rahayu',
    desa: 'Teguhan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Teguh Tani',
    namaKelompok: 'Ngudi Rahayu',
    desa: 'Teguhan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Teguh Tani',
    namaKelompok: 'Sri Mulih',
    desa: 'Teguhan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Widodo Mulyo',
    namaKelompok: 'Sri Asih',
    desa: 'Sirigan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Widodo Mulyo',
    namaKelompok: 'Tani Mulyo',
    desa: 'Sirigan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Widodo Mulyo',
    namaKelompok: 'Tani Mumpuni',
    desa: 'Sirigan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Bakti Tani',
    namaKelompok: 'Sri Bhakti',
    desa: 'Jeblogan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Bakti Tani',
    namaKelompok: 'Mardi Rahayu',
    desa: 'Jeblogan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Bakti Tani',
    namaKelompok: 'Budi Luhur',
    desa: 'Jeblogan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Bakti Tani',
    namaKelompok: 'Sri Mekar',
    desa: 'Jeblogan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Bakti Tani',
    namaKelompok: 'Mekar Sari',
    desa: 'Jeblogan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Tani Mulyo',
    desa: 'Jambangan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Sri Makmur',
    desa: 'Jambangan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Barokah',
    desa: 'Jambangan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Sri Asih',
    desa: 'Jambangan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Sri Rejeki',
    desa: 'Jambangan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Margo Tani',
    desa: 'Jambangan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Sumber Urip',
    desa: 'Jambangan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Sri Widodo',
    desa: 'Jambangan',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Tani Jaya',
    desa: 'Tempuran',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Tempuran',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Sido Makmur',
    desa: 'Tempuran',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Ngudi Utomo',
    desa: 'Tempuran',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Tani Rejo',
    desa: 'Tempuran',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Karya Tani',
    desa: 'Tempuran',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Tani Murni',
    desa: 'Tempuran',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Sri Mentes',
    desa: 'Tempuran',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Tani Langgeng',
    desa: 'Tempuran',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Sidodadi',
    desa: 'Dawu',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Sri Mekar',
    desa: 'Dawu',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Mitra Tani',
    namaKelompok: 'Tani Makmur',
    desa: 'Dawu',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Tani Subur',
    desa: 'Paron',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Tani Sentosa',
    desa: 'Paron',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Karya Tani',
    namaKelompok: 'Tani Bahagia',
    desa: 'Paron',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Prima Tani',
    namaKelompok: 'Sumber Bumi I',
    desa: 'Gelung',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Prima Tani',
    namaKelompok: 'Sumber Bumi II',
    desa: 'Gelung',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Prima Tani',
    namaKelompok: 'Sumber Rejeki I',
    desa: 'Gelung',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Prima Tani',
    namaKelompok: 'Sumber Rejeki II',
    desa: 'Gelung',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Prima Tani',
    namaKelompok: 'Tani Karya',
    desa: 'Gelung',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Prima Tani',
    namaKelompok: 'Muliya',
    desa: 'Gelung',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Prima Tani',
    namaKelompok: 'Sido Mekar',
    desa: 'Gelung',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Guyub',
    namaKelompok: 'Margo Rukun',
    desa: 'Ngale',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Guyub',
    namaKelompok: 'Sedyo Makmur',
    desa: 'Ngale',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Guyub',
    namaKelompok: 'Sedyo Rukun I',
    desa: 'Ngale',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Guyub',
    namaKelompok: 'Sedyo Rukun II',
    desa: 'Ngale',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Guyub',
    namaKelompok: 'Sedyo Rahayu',
    desa: 'Ngale',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Guyub',
    namaKelompok: 'Tani Subur I',
    desa: 'Ngale',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Guyub',
    namaKelompok: 'Tani Subur II',
    desa: 'Ngale',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Guyub',
    namaKelompok: 'Tani Mulyo',
    desa: 'Ngale',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Rukun',
    namaKelompok: 'Sri Utomo',
    desa: 'Kebon',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Rukun',
    namaKelompok: 'Tani Rukun',
    desa: 'Kebon',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Rukun',
    namaKelompok: 'Karya Tani',
    desa: 'Kebon',
    kecamatan: 'Paron'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Sedyo Rukun',
    desa: 'Begal',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Mekar Sari',
    desa: 'Begal',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Tempursari',
    desa: 'Begal',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Sri Sobo Siti',
    desa: 'Begal',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Rahayu',
    desa: 'Begal',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Bulak Sari',
    desa: 'Begal',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Makmur',
    desa: 'Begal',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Tani Mulyo',
    namaKelompok: 'Ngudi Santoso',
    desa: 'Begal',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Wonorejo Lestari',
    namaKelompok: 'Arco Mulyo',
    desa: 'Wonorejo',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Wonorejo Lestari',
    namaKelompok: 'Lestari I',
    desa: 'Wonorejo',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Wonorejo Lestari',
    namaKelompok: 'Lestari II',
    desa: 'Wonorejo',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Wonorejo Lestari',
    namaKelompok: 'Lestari III',
    desa: 'Wonorejo',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Wonorejo Lestari',
    namaKelompok: 'Brubahan',
    desa: 'Wonorejo',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Sekar Tani',
    namaKelompok: 'Ngudi Rahayu',
    desa: 'Katikan',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Sekar Tani',
    namaKelompok: 'Manggis',
    desa: 'Katikan',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Sekar Tani',
    namaKelompok: 'Bulak Rejo',
    desa: 'Katikan',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Sekar Tani',
    namaKelompok: 'Gebung Sari',
    desa: 'Katikan',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Sekar Tani',
    namaKelompok: 'Tawang Sari',
    desa: 'Katikan',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Sekar Tani',
    namaKelompok: 'Tirto Mulyo',
    desa: 'Katikan',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Sekar Tani',
    namaKelompok: 'Mekar Usaha',
    desa: 'Katikan',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Sekar Tani',
    namaKelompok: 'Tunas Harapan',
    desa: 'Katikan',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Pelang Makmur',
    namaKelompok: 'Mekar Sari I',
    desa: 'Pelang Kidul',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Pelang Makmur',
    namaKelompok: 'Mekar Sari II',
    desa: 'Pelang Kidul',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Pelang Makmur',
    namaKelompok: 'Pelang',
    desa: 'Pelang Kidul',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Pelang Makmur',
    namaKelompok: 'Mutiara',
    desa: 'Pelang Kidul',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Pelang Makmur',
    namaKelompok: 'Sumber Waras I',
    desa: 'Pelang Kidul',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Pelang Makmur',
    namaKelompok: 'Sumber Waras II',
    desa: 'Pelang Kidul',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Pelang Makmur',
    namaKelompok: 'Wates',
    desa: 'Pelang Kidul',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Pelang Makmur',
    namaKelompok: 'Ponjen',
    desa: 'Pelang Kidul',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Garda Tani',
    namaKelompok: 'Tani Manunggal',
    desa: 'Kedunggalar',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Garda Tani',
    namaKelompok: 'Tani Maju',
    desa: 'Kedunggalar',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Garda Tani',
    namaKelompok: 'Sumber Makmur',
    desa: 'Kedunggalar',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Garda Tani',
    namaKelompok: 'Margo Rahayu',
    desa: 'Kedunggalar',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Garda Tani',
    namaKelompok: 'Ngupoyo Boga',
    desa: 'Kedunggalar',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Garda Tani',
    namaKelompok: 'Muji Rahayu',
    desa: 'Kedunggalar',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Garda Tani',
    namaKelompok: 'Tani Mulyo',
    desa: 'Kedunggalar',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Garda Tani',
    namaKelompok: 'Sri Rahayu',
    desa: 'Kedunggalar',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Garda Tani',
    namaKelompok: 'Ngudi Makmur',
    desa: 'Kedunggalar',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Garda Tani',
    namaKelompok: 'Ngudi Mulyo',
    desa: 'Kedunggalar',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Garda Tani',
    namaKelompok: 'Tani Rukun',
    desa: 'Kedunggalar',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Jati Manunggal',
    namaKelompok: 'Tani Makmur',
    desa: 'Jatigembol',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Jati Manunggal',
    namaKelompok: 'Karya Makmur',
    desa: 'Jatigembol',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Jati Manunggal',
    namaKelompok: 'Pilang Sari',
    desa: 'Jatigembol',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Jati Manunggal',
    namaKelompok: 'Tani Mulyo',
    desa: 'Jatigembol',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Jati Manunggal',
    namaKelompok: 'Jatigembol',
    desa: 'Jatigembol',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Jati Manunggal',
    namaKelompok: 'Sri Mulyo',
    desa: 'Jatigembol',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Jati Manunggal',
    namaKelompok: 'Sri Karya',
    desa: 'Jatigembol',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Jati Manunggal',
    namaKelompok: 'Sri Rejeki',
    desa: 'Jatigembol',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Surya Tani',
    namaKelompok: 'Ngudi Lestari',
    desa: 'Pelang Lor',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Surya Tani',
    namaKelompok: 'Tambak Selo',
    desa: 'Pelang Lor',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Surya Tani',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Pelang Lor',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Surya Tani',
    namaKelompok: 'Tani Mulyo',
    desa: 'Pelang Lor',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Surya Tani',
    namaKelompok: 'Soco Tani I',
    desa: 'Pelang Lor',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Surya Tani',
    namaKelompok: 'Soco Tani II',
    desa: 'Pelang Lor',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Bangun Tani',
    namaKelompok: 'Poh Jagal I',
    desa: 'Bangunrejo Kidul',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Bangun Tani',
    namaKelompok: 'Poh Jagal II',
    desa: 'Bangunrejo Kidul',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Bangun Tani',
    namaKelompok: 'Nuju Mulyo I',
    desa: 'Bangunrejo Kidul',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Bangun Tani',
    namaKelompok: 'Nuju Mulyo II',
    desa: 'Bangunrejo Kidul',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Bangun Tani',
    namaKelompok: 'Margo Makmur',
    desa: 'Bangunrejo Kidul',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Bangun Tani',
    namaKelompok: 'Ngudi Mulyo',
    desa: 'Bangunrejo Kidul',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Bangun Tani',
    namaKelompok: 'Blombangrejo',
    desa: 'Bangunrejo Kidul',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Bangun Tani',
    namaKelompok: 'Margo Utomo',
    desa: 'Bangunrejo Kidul',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Bangun Tani',
    namaKelompok: 'Alas Budi',
    desa: 'Bangunrejo Kidul',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Bangun Tani',
    namaKelompok: 'Golan Tani',
    desa: 'Bangunrejo Kidul',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Sinar Hikmah',
    namaKelompok: 'Sinar Tani',
    desa: 'Jenggrik',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Sinar Hikmah',
    namaKelompok: 'Sinar Jaya',
    desa: 'Jenggrik',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Sinar Hikmah',
    namaKelompok: 'Sinar Ratih',
    desa: 'Jenggrik',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Sinar Hikmah',
    namaKelompok: 'Sinar Wulan',
    desa: 'Jenggrik',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Sinar Hikmah',
    namaKelompok: 'Sinar Mulyo',
    desa: 'Jenggrik',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Sinar Hikmah',
    namaKelompok: 'Sinar Rejeki',
    desa: 'Jenggrik',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Sinar Hikmah',
    namaKelompok: 'Sinar Utama',
    desa: 'Jenggrik',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Sinar Hikmah',
    namaKelompok: 'Sinar Sri',
    desa: 'Jenggrik',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Sinar Hikmah',
    namaKelompok: 'Sinar Lestari',
    desa: 'Jenggrik',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Rukun Tani',
    namaKelompok: 'Jaya Murni',
    desa: 'Wonokerto',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Rukun Tani',
    namaKelompok: 'Sri Langgeng',
    desa: 'Wonokerto',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Rukun Tani',
    namaKelompok: 'Tani Mulyo',
    desa: 'Wonokerto',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Rukun Tani',
    namaKelompok: 'Sri Rejeki',
    desa: 'Wonokerto',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Rukun Tani',
    namaKelompok: 'Tani Jaya',
    desa: 'Wonokerto',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Ngudi Mulyo I',
    desa: 'Gemarang',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Sri Ngudi Lestari',
    desa: 'Gemarang',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Mekar Sari',
    desa: 'Gemarang',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Tani Mulyo',
    desa: 'Gemarang',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Sri Rejeki',
    desa: 'Gemarang',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Ngudi Mulyo II',
    desa: 'Gemarang',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Sri Mulyo',
    desa: 'Gemarang',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Gemarang',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Tani Rahayu',
    desa: 'Gemarang',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Ngudi Raharjo',
    desa: 'Gemarang',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Ngudi Makmur',
    desa: 'Gemarang',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Ngudi Rahayu',
    desa: 'Gemarang',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Ngudi Tani',
    desa: 'Gemarang',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Sri Ponjen',
    desa: 'Gemarang',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Sri Lestari',
    desa: 'Gemarang',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Guyub Rukun',
    namaKelompok: 'Tani Maju',
    desa: 'Gemarang',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Kawu Sejahtera',
    namaKelompok: 'Ngudi Makmur',
    desa: 'Kawu',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Kawu Sejahtera',
    namaKelompok: 'Sri Makmur',
    desa: 'Kawu',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Kawu Sejahtera',
    namaKelompok: 'Tani Makmur',
    desa: 'Kawu',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Kawu Sejahtera',
    namaKelompok: 'Sri Rejeki',
    desa: 'Kawu',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Kawu Sejahtera',
    namaKelompok: 'Sri Asih',
    desa: 'Kawu',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Kawu Sejahtera',
    namaKelompok: 'Tani Mulyo',
    desa: 'Kawu',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Kawu Sejahtera',
    namaKelompok: 'Kartini',
    desa: 'Kawu',
    kecamatan: 'Kedunggalar'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Sri Rejeki',
    desa: 'Banjarbanggi',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Tirto Utomo',
    desa: 'Banjarbanggi',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Sri Lestari',
    desa: 'Banjarbanggi',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Tani Makmur',
    desa: 'Banjarbanggi',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Tani Rukun',
    desa: 'Banjarbanggi',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Sejahtera',
    namaKelompok: 'Sidodadi',
    desa: 'Bangunrejo Lor',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Sejahtera',
    namaKelompok: 'Sumber Urip',
    desa: 'Bangunrejo Lor',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Sejahtera',
    namaKelompok: 'Gawe Rukun',
    desa: 'Bangunrejo Lor',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Sejahtera',
    namaKelompok: 'Ngrandu',
    desa: 'Bangunrejo Lor',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Ngudi Sejahtera',
    desa: 'Karanggeneng',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Ngudi Luhur',
    desa: 'Karanggeneng',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Ngudi Rejeki',
    desa: 'Karanggeneng',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Sido Makmur',
    namaKelompok: 'Ngudi Makmur',
    desa: 'Karanggeneng',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Aneka Tani',
    desa: 'Papungan',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Tani Maju',
    desa: 'Papungan',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Sumber Tani',
    namaKelompok: 'Eko Tani',
    desa: 'Papungan',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Tani Mulyo',
    desa: 'Cantel',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Sumber Makmur',
    desa: 'Cantel',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Sri Mulyo',
    desa: 'Cantel',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Sumber Rejeki',
    namaKelompok: 'Tani Asih',
    desa: 'Cantel',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Lumbung Jaya',
    desa: 'Ngancar',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Bina Sejahtera',
    desa: 'Ngancar',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Sri Mukti',
    desa: 'Ngancar',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Tani Makmur',
    desa: 'Ngancar',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Mandiri',
    desa: 'Ngancar',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Manunggal',
    namaKelompok: 'Sumber Tani',
    desa: 'Kalang',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Manunggal',
    namaKelompok: 'Pojok Raharjo',
    desa: 'Kalang',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Manunggal',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Kalang',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Manunggal',
    namaKelompok: 'Tani Makmur',
    desa: 'Kalang',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Manunggal',
    namaKelompok: 'Tani Baru',
    desa: 'Kalang',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Lumayan',
    namaKelompok: 'Seger Waras',
    desa: 'Pitu',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Lumayan',
    namaKelompok: 'Seger Waras I',
    desa: 'Pitu',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Lumayan',
    namaKelompok: 'Sri Rejeki',
    desa: 'Pitu',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Lumayan',
    namaKelompok: 'Karya Tani I',
    desa: 'Pitu',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Lumayan',
    namaKelompok: 'Karya Tani II',
    desa: 'Pitu',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Lumayan',
    namaKelompok: 'Tani Makmur',
    desa: 'Pitu',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Lumayan',
    namaKelompok: 'Gubug Mulyo',
    desa: 'Pitu',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Bhakti Tani',
    namaKelompok: 'Mardi Laras',
    desa: 'Dumplengan',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Bhakti Tani',
    namaKelompok: 'Sumber Makmur',
    desa: 'Dumplengan',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Bhakti Tani',
    namaKelompok: 'Suka Maju',
    desa: 'Dumplengan',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Bhakti Tani',
    namaKelompok: 'Karya Tani',
    desa: 'Dumplengan',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Bhakti Tani',
    namaKelompok: 'Karya Bhakti',
    desa: 'Dumplengan',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Selo Makmur',
    namaKelompok: 'Enggal Makmur',
    desa: 'Selopuro',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Selo Makmur',
    namaKelompok: 'Maju Mapan',
    desa: 'Selopuro',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Selo Makmur',
    namaKelompok: 'Sendang Rejeki',
    desa: 'Selopuro',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Selo Makmur',
    namaKelompok: 'Bantoro Asri',
    desa: 'Selopuro',
    kecamatan: 'Pitu'
  },
  {
    gapoktan: 'Lestari Jaya',
    namaKelompok: 'Mugi Rahayu',
    desa: 'Banyubiru',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Lestari Jaya',
    namaKelompok: 'Tani Rahayu',
    desa: 'Banyubiru',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Lestari Jaya',
    namaKelompok: 'Lestari',
    desa: 'Banyubiru',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Lestari Jaya',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Banyubiru',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Lestari Jaya',
    namaKelompok: 'Jinawi',
    desa: 'Banyubiru',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mukti Rahayu',
    namaKelompok: 'Sri Rejeki',
    desa: 'Kedunggudel',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mukti Rahayu',
    namaKelompok: 'Tani Makmur',
    desa: 'Kedunggudel',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mukti Rahayu',
    namaKelompok: 'Nglebaksari',
    desa: 'Kedunggudel',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mukti Rahayu',
    namaKelompok: 'Rahayu',
    desa: 'Kedunggudel',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mukti Rahayu',
    namaKelompok: 'Pangudi Luhur',
    desa: 'Kedunggudel',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Tanjung Mulyo',
    namaKelompok: 'Sri Rejeki',
    desa: 'Kayutrejo',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Tanjung Mulyo',
    namaKelompok: 'Sumber Kayut',
    desa: 'Kayutrejo',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Tanjung Mulyo',
    namaKelompok: 'Sido Makmur',
    desa: 'Kayutrejo',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Tanjung Mulyo',
    namaKelompok: 'Tani Mulyo',
    desa: 'Kayutrejo',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Tanjung Mulyo',
    namaKelompok: 'Sumber Mulyo',
    desa: 'Kayutrejo',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Tanjung Mulyo',
    namaKelompok: 'Bangun Mulyo',
    desa: 'Kayutrejo',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Sekar Mulyo',
    namaKelompok: 'Selo Madu',
    desa: 'Sekaralas',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Sekar Mulyo',
    namaKelompok: 'Sekar Sari',
    desa: 'Sekaralas',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Sekar Mulyo',
    namaKelompok: 'Dulangtani',
    desa: 'Sekaralas',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Sekar Mulyo',
    namaKelompok: 'Wadangsari',
    desa: 'Sekaralas',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Sekar Mulyo',
    namaKelompok: 'Sri Langgeng',
    desa: 'Sekaralas',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Sekar Jaya',
    namaKelompok: 'Bedegan Tani',
    desa: 'Sekarputih',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Sekar Jaya',
    namaKelompok: 'Sekar Tani',
    desa: 'Sekarputih',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Sekar Jaya',
    namaKelompok: 'Sri Rahayu',
    desa: 'Sekarputih',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Sekar Jaya',
    namaKelompok: 'Kenongo Mulyo',
    desa: 'Sekarputih',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Sekar Jaya',
    namaKelompok: 'Kebon Agung',
    desa: 'Sekarputih',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Suko Tani',
    desa: 'Sidomakmur',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Puntuk Tani',
    desa: 'Sidomakmur',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Crawuk Tani',
    desa: 'Sidomakmur',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Tani Kuncoro',
    desa: 'Sidomakmur',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Kasih Tani',
    desa: 'Sidomakmur',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mekar Tani',
    namaKelompok: 'Jenak Tani',
    desa: 'Sidolaju',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mekar Tani',
    namaKelompok: 'Tani Mulyo',
    desa: 'Sidolaju',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mekar Tani',
    namaKelompok: 'Sedyo Rukun',
    desa: 'Sidolaju',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mekar Tani',
    namaKelompok: 'Sidorejo Tani',
    desa: 'Sidolaju',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mekar Tani',
    namaKelompok: 'Kerjo Tani',
    desa: 'Sidolaju',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mekar Tani',
    namaKelompok: 'Mloso Tani',
    desa: 'Sidolaju',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mekar Tani',
    namaKelompok: 'Tanon Tani',
    desa: 'Sidolaju',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mekar Tani',
    namaKelompok: 'Sido Tani',
    desa: 'Sidolaju',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mulyo Agung',
    namaKelompok: 'Sido Rukun',
    desa: 'Karangbanyu',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mulyo Agung',
    namaKelompok: 'Jatisari',
    desa: 'Karangbanyu',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mulyo Agung',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Karangbanyu',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mulyo Agung',
    namaKelompok: 'Wonokerto',
    desa: 'Karangbanyu',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mulyo Agung',
    namaKelompok: 'Margomulyo',
    desa: 'Karangbanyu',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mulyo Agung',
    namaKelompok: 'Butuh Tani',
    desa: 'Karangbanyu',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Mulyo Agung',
    namaKelompok: 'Tretes Tani',
    desa: 'Karangbanyu',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Rukun Makmur',
    namaKelompok: 'Gebang Sari',
    desa: 'Walikukun',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Rukun Makmur',
    namaKelompok: 'Getas Sari',
    desa: 'Walikukun',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Rukun Makmur',
    namaKelompok: 'Sri Rejeki',
    desa: 'Walikukun',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Rukun Makmur',
    namaKelompok: 'Sri Widodo',
    desa: 'Walikukun',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Bulung Sari',
    desa: 'Widodaren',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Sri Makmur',
    desa: 'Widodaren',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Sri Rejeki',
    desa: 'Widodaren',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Tani Makmur',
    namaKelompok: 'Gemah Ripah',
    desa: 'Widodaren',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Marsudi Tani',
    namaKelompok: 'Pandan Sari',
    desa: 'Gendingan',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Marsudi Tani',
    namaKelompok: 'Jaten Sari',
    desa: 'Gendingan',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Marsudi Tani',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Gendingan',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Marsudi Tani',
    namaKelompok: 'Edi Peni',
    desa: 'Gendingan',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Marsudi Tani',
    namaKelompok: 'Rejo Sari',
    desa: 'Gendingan',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Marsudi Tani',
    namaKelompok: 'Kedung Sari',
    desa: 'Gendingan',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Dirgosari',
    namaKelompok: 'Among Kismo',
    desa: 'Kauman',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Dirgosari',
    namaKelompok: 'Dirgo Sari',
    desa: 'Kauman',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Dirgosari',
    namaKelompok: 'Sumber Makmur',
    desa: 'Kauman',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Dirgosari',
    namaKelompok: 'Tanjang Sari',
    desa: 'Kauman',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Dirgosari',
    namaKelompok: 'Gembung Sari',
    desa: 'Kauman',
    kecamatan: 'Widodaren'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Sido Mulyo',
    desa: 'Tambakboyo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Bulak Gadungan',
    desa: 'Tambakboyo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Tempursari',
    desa: 'Tambakboyo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Pondok',
    desa: 'Tambakboyo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Kepohan',
    desa: 'Tambakboyo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Ngudi Makmur',
    namaKelompok: 'Murni',
    desa: 'Tambakboyo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Manunggal Sejati',
    namaKelompok: 'Sidodadi',
    desa: 'Pakah',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Manunggal Sejati',
    namaKelompok: 'Tani Maju',
    desa: 'Pakah',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Manunggal Sejati',
    namaKelompok: 'Bondan Tani',
    desa: 'Pakah',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Manunggal Sejati',
    namaKelompok: 'Bangsri',
    desa: 'Pakah',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Manunggal Sejati',
    namaKelompok: 'Krawang',
    desa: 'Pakah',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Manunggal Sejati',
    namaKelompok: 'Margo Tresna',
    desa: 'Pakah',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Manunggal Sejati',
    namaKelompok: 'Jaya Mandiri',
    desa: 'Pakah',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Manunggal Tani',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Kedungharjo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Manunggal Tani',
    namaKelompok: 'Margo Rukun',
    desa: 'Kedungharjo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Manunggal Tani',
    namaKelompok: 'Tani Mulyo',
    desa: 'Kedungharjo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Manunggal Tani',
    namaKelompok: 'Losari',
    desa: 'Kedungharjo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Manunggal Tani',
    namaKelompok: 'Margo Mulyo',
    desa: 'Kedungharjo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Manunggal Tani',
    namaKelompok: 'Sendang Mulyo',
    desa: 'Kedungharjo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Mekar Sari',
    namaKelompok: 'Tambak Sari I',
    desa: 'Mantingan',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Mekar Sari',
    namaKelompok: 'Tambak Sari II',
    desa: 'Mantingan',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Mekar Sari',
    namaKelompok: 'Sekar Sari I',
    desa: 'Mantingan',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Mekar Sari',
    namaKelompok: 'Sekar Sari II',
    desa: 'Mantingan',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Mekar Sari',
    namaKelompok: 'Ledok Sari I',
    desa: 'Mantingan',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Mekar Sari',
    namaKelompok: 'Ledok Sari II',
    desa: 'Mantingan',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Mekar Sari',
    namaKelompok: 'Sri Agung',
    desa: 'Mantingan',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Mekar Sari',
    namaKelompok: 'Sekar Gading I',
    desa: 'Mantingan',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Mekar Sari',
    namaKelompok: 'Sekar Gading II',
    desa: 'Mantingan',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Mekar Sari',
    namaKelompok: 'Ganggang Sari',
    desa: 'Mantingan',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Jadi Makmur',
    namaKelompok: 'Kartika Mulya',
    desa: 'Sambirejo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Jadi Makmur',
    namaKelompok: 'Sari Tani',
    desa: 'Sambirejo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Jadi Makmur',
    namaKelompok: 'Dewi Sri',
    desa: 'Sambirejo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Jadi Makmur',
    namaKelompok: 'Teluk Tani',
    desa: 'Sambirejo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Jadi Makmur',
    namaKelompok: 'Karya Tani',
    desa: 'Sambirejo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Jadi Makmur',
    namaKelompok: 'Sri Gading',
    desa: 'Sambirejo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Jadi Makmur',
    namaKelompok: 'Amurat',
    desa: 'Sambirejo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Jadi Makmur',
    namaKelompok: 'Tani Makmur',
    desa: 'Sambirejo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Jadi Makmur',
    namaKelompok: 'Sambi Mulyo',
    desa: 'Sambirejo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Jadi Makmur',
    namaKelompok: 'Rejo Tani',
    desa: 'Sambirejo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Jadi Makmur',
    namaKelompok: 'Pondok Gontor',
    desa: 'Sambirejo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Intan Tani',
    namaKelompok: 'Sri Rejeki',
    desa: 'Pengkol',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Intan Tani',
    namaKelompok: 'Tunas Harapan',
    desa: 'Pengkol',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Intan Tani',
    namaKelompok: 'Tani Rukun',
    desa: 'Pengkol',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Intan Tani',
    namaKelompok: 'Margo Rukun',
    desa: 'Pengkol',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Intan Tani',
    namaKelompok: 'Margo Mulyo',
    desa: 'Pengkol',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Intan Tani',
    namaKelompok: 'Candi Tani',
    desa: 'Pengkol',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Intan Tani',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Pengkol',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Intan Tani',
    namaKelompok: 'Subur Makmur',
    desa: 'Pengkol',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Intan Tani',
    namaKelompok: 'Candi Mulyo',
    desa: 'Pengkol',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Mulyo Sari',
    namaKelompok: 'Sri Rejeki',
    desa: 'Jatimulyo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Mulyo Sari',
    namaKelompok: 'Sumber Sari',
    desa: 'Jatimulyo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Mulyo Sari',
    namaKelompok: 'Tlogo Sari',
    desa: 'Jatimulyo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Mulyo Sari',
    namaKelompok: 'Losari',
    desa: 'Jatimulyo',
    kecamatan: 'Mantingan'
  },
  {
    gapoktan: 'Sekar Tani',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Sekarjati',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Sekar Tani',
    namaKelompok: 'Sekar Putih',
    desa: 'Sekarjati',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Sekar Tani',
    namaKelompok: 'Bina Karya',
    desa: 'Sekarjati',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Sekar Tani',
    namaKelompok: 'Sumber Widodo',
    desa: 'Sekarjati',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Bangun Rejeki',
    namaKelompok: 'Sri Makmur',
    desa: 'Bangunrejo',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Bangun Rejeki',
    namaKelompok: 'Sri Widodo',
    desa: 'Bangunrejo',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Bangun Rejeki',
    namaKelompok: 'Sri Langgeng',
    desa: 'Bangunrejo',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Bangun Rejeki',
    namaKelompok: 'Sri Lestari',
    desa: 'Bangunrejo',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Bangun Rejeki',
    namaKelompok: 'Wonosari',
    desa: 'Bangunrejo',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Sriwedari',
    namaKelompok: 'Sri Rejeki',
    desa: 'Sriwedari',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Sriwedari',
    namaKelompok: 'Bedug Sari',
    desa: 'Sriwedari',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Sriwedari',
    namaKelompok: 'Sari Mulyo I',
    desa: 'Sriwedari',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Sriwedari',
    namaKelompok: 'Sari Mulyo II',
    desa: 'Sriwedari',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Sriwedari',
    namaKelompok: 'Candi Sari',
    desa: 'Sriwedari',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Sriwedari',
    namaKelompok: 'Mekar Sari',
    desa: 'Sriwedari',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Ngudi Rejeki',
    namaKelompok: 'Rukun Makmur',
    desa: 'Mengger',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Ngudi Rejeki',
    namaKelompok: 'Gugur Sari',
    desa: 'Mengger',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Ngudi Rejeki',
    namaKelompok: 'Sido Rukun',
    desa: 'Mengger',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Ngudi Rejeki',
    namaKelompok: 'Sumber Rejeki',
    desa: 'Mengger',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Sido Makmur',
    desa: 'Pandean',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Ngrebeng I',
    desa: 'Pandean',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Ngrebeng II',
    desa: 'Pandean',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Nglegok Sari',
    desa: 'Pandean',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Sido Dadi',
    desa: 'Pandean',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Tani Raharjo',
    desa: 'Pandean',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Tani Karya',
    desa: 'Pandean',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Sumber Makmur',
    desa: 'Pandean',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Karanganyar Abadi',
    namaKelompok: 'Sri Langgeng',
    desa: 'Karanganyar',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Karanganyar Abadi',
    namaKelompok: 'Karang Asri',
    desa: 'Karanganyar',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Karanganyar Abadi',
    namaKelompok: 'Sri Rejeki',
    desa: 'Karanganyar',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Karanganyar Abadi',
    namaKelompok: 'Sido Makmur',
    desa: 'Karanganyar',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Karanganyar Abadi',
    namaKelompok: 'Rahayu Widodo',
    desa: 'Karanganyar',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Karanganyar Abadi',
    namaKelompok: 'Sido Dadi',
    desa: 'Karanganyar',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Karanganyar Abadi',
    namaKelompok: 'Talok Tani',
    desa: 'Karanganyar',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Sri Lestari',
    desa: 'Gembol',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Sri Makmur',
    desa: 'Gembol',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Sempulur',
    desa: 'Gembol',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Sari Bumi',
    desa: 'Gembol',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Pilang Sari',
    desa: 'Gembol',
    kecamatan: 'Karanganyar'
  },
  {
    gapoktan: 'Tani Maju',
    namaKelompok: 'Sri Rahayu',
    desa: 'Gembol',
    kecamatan: 'Karanganyar'
  }
];

module.exports = data;
