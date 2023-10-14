import { supabase } from './db';

type ConversationLogEntry = {
  entry: string,
  created_at: Date,
  speaker: string,
}

class Conversation {
  public async addEntry({ entry, speaker }: { entry: string, speaker: string }) {
    try {
      /* await sequelize.query(`INSERT INTO conversations (user_id, entry, speaker) VALUES (?, ?, ?) ON CONFLICT (created_at) DO NOTHING`, {
        replacements: [this.userId, entry, speaker],
      }); */
      await supabase.from("conversations").insert(
        { entry, speaker }
      );
    } catch (e) {
      console.log(`Error adding entry: ${e}`)
    }
  }

  public async getConversation({ limit }: { limit: number }): Promise<string[]> {
    // const conversation = await sequelize.query(`SELECT entry, speaker, created_at FROM conversations WHERE user_id = '${this.userId}' ORDER By created_at DESC LIMIT ${limit}`);
    const conversation = await supabase.from("conversations").select().order("created_at", {ascending: false}).limit(limit);
    console.log('conversation', conversation);

    if (!conversation.data) {
      return [];
    }
    
    const history = conversation.data?.length ? conversation.data[0] as ConversationLogEntry[] : [];

    return history.map((entry) => {
      return `${entry.speaker.toUpperCase()}: ${entry.entry}`
    }).reverse()
  }

  public async clearConversation() {
    await supabase.from("conversations").delete();
  }
}

export { Conversation }