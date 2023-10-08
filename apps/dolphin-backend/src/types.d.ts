declare namespace Express {
  export interface Request {
    userId: string;
    tgQueryId?: string;
    userLang?: string;
  }
}
