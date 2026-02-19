import { chatbotReply } from '../services/chatbotService.js';

export const askAssistant = async (req, res) => {
  const { query } = req.body;
  const response = await chatbotReply(query);
  res.json(response);
};
