
interface Message {
  id?: string; // ID unik dari dokumen Firestore
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'read' | 'failed'; // Status pesan
}
const MessageStatus = ({ status, isCurrentUser }: { status: Message['status'], isCurrentUser: boolean }) => {
  // Tampilkan status hanya untuk pesan yang dikirim oleh pengguna saat ini
  if (!isCurrentUser) {
    return null;
  }

  switch (status) {
    case 'sending':
      // Kita tidak menampilkan ikon sending di daftar chat, jadi return null
      return null;
    case 'sent':
      return <span title="Terkirim">✓</span>;
    case 'read':
      return <span title="Dibaca" style={{ color: '#53bdeb' }}>✓✓</span>;
    case 'failed':
      return <span title="Gagal terkirim">❗</span>;
    default:
      return null;
  }
};

export default MessageStatus;