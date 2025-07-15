 jadi aku akan coba login sebagai 2 user dengan 2 browser berbeda, saat aku login sebagai si b yang belum add siapapun tapi si a sebelumnya add si b lewat page find friend lists, apakah pesan ku masuk ke si b ??

 Sisi Pengirim (Si A): Kamu (Si A) sudah menambahkan Si B. Jadi, UID Si B ada di daftar temanmu. Kamu bisa melihat profilnya, memilihnya, dan mengirim pesan. Aplikasi akan mengirim pesan ke room yang benar (room-UID_A-UID_B).

Sisi Penerima (Si B): Karena Si B belum menambahkanmu, UID-mu (Si A) tidak ada di daftar temannya. Akibatnya:

Di halaman DaftarEmailChat atau EmailFriendLists, profilmu tidak akan muncul.

Si B tidak punya cara untuk mengklik namamu dan membuka halaman chat denganmu.

Karena dia tidak pernah membuka halaman chat denganmu, aplikasinya tidak pernah menjalankan perintah socket.emit('join_room', 'room-UID_A-UID_B').

Kesimpulan: Pesanmu terkirim dari klien A ke server, menunggu di room itu. Tapi karena klien B tidak pernah masuk ke room yang sama, pesan itu tidak akan pernah sampai ke layarnya. Pesanmu "tersesat di jalan".

kerjakan ini :
Solusi Terbaik: Sistem Pertemanan Mutual (Friend Request)
Cara paling umum dan benar untuk mengatasi ini adalah dengan sistem "Permintaan Pertemanan".

A Mengirim Permintaan: Ketika A menambahkan B, jangan langsung simpan UID B di daftar teman A. Sebaliknya, buat koleksi baru di Firestore, misalnya friendRequests, dengan dokumen { from: 'UID_A', to: 'UID_B', status: 'pending' }.

B Menerima Notifikasi: Si B akan punya notifikasi atau tab "Permintaan Pertemanan" yang menampilkan permintaan dari A.

B Menerima/Menolak:

Jika B menerima, barulah kamu melakukan update: tambahkan UID B ke friends A, dan tambahkan UID A ke friends B. Hapus dokumen permintaan tadi.

Jika B menolak, cukup hapus dokumen permintaan.

Dengan cara ini, obrolan hanya bisa terjadi jika kedua belah pihak sudah setuju berteman, memastikan tidak ada pesan yang "tersesat".