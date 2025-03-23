import Message from '../models/Message.mjs';

class MessageService {
  static async submitMessage({ name, email, subject, message }) {
    const newMessage = new Message({ name, email, subject, message });
    return newMessage.save();
  }
}

export default MessageService;