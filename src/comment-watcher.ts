import EventEmitter from 'events';

import { Reddit } from './reddit';
import { Comment } from './reddit/comment';

type Filter = (comment: Comment) => boolean;

export class CommentWatcher extends EventEmitter {
  public static COMMENTS_EVENT = 'COMMENTS';
  public static DEFAULT_SUBREDDIT = 'all';

  private reddit: Reddit;
  private filter?: Filter;
  private subreddit: string;
  private running: boolean = false;

  constructor(options: { reddit: Reddit; subreddit: string; filter?: Filter }) {
    super();
    this.reddit = options.reddit;
    this.subreddit = options.subreddit || CommentWatcher.DEFAULT_SUBREDDIT;
    this.filter = options.filter;
  }

  async start() {
    this.running = true;
    while (this.running) {
      let comments = await this.reddit.getComments({ subreddit: this.subreddit });
      if (this.filter) {
        comments = comments.filter(this.filter);
      }

      if (comments.length > 0) {
        this.emit(CommentWatcher.COMMENTS_EVENT, comments);
      }
    }
  }

  stop() {
    this.running = false;
  }
}
