export interface Task {
  id: string;
  title: string;
  completed: boolean;
  user_id: number;
  created_at: string;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}
