import { Reddit } from './reddit';
import { Comment } from './reddit/comment';

type Filter = (comment: Comment) => boolean;
type Action = (comments: Comment[]) => Promise<void>;

export class CommentWatcher {
  private reddit: Reddit;
  private filter: Filter;
  private action: Action;
  private running: boolean = false;

  constructor(options: { reddit: Reddit; filter: Filter; action: Action }) {
    this.reddit = options.reddit;
    this.filter = options.filter;
    this.action = options.action;
  }

  async start() {
    this.running = true;
    do {
      const comments = await this.reddit.getComments();
      const matchingComments = comments.filter(this.filter);
      await this.action(matchingComments);
    } while (this.running);
  }

  stop() {
    this.running = false;
  }
}
