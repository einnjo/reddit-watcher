import EventEmitter from 'events';

import { Reddit } from './reddit';
import { Comment } from './reddit/comment';

type Filter = (comment: Comment) => boolean;

export class CommentWatcher extends EventEmitter {
  public static COMMENTS_EVENT = 'COMMENTS';

  private reddit: Reddit;
  private filter: Filter;
  private running: boolean = false;

  constructor(options: { reddit: Reddit; filter: Filter }) {
    super();
    this.reddit = options.reddit;
    this.filter = options.filter;
  }

  async start() {
    this.running = true;
    while (this.running) {
      const comments = await this.reddit.getComments();
      const matchingComments = comments.filter(this.filter);
      this.emit(CommentWatcher.COMMENTS_EVENT, matchingComments);
    }
  }

  stop() {
    this.running = false;
  }
}
