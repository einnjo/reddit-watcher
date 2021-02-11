import { createNanoEvents, Emitter } from 'nanoevents';
import { Reddit } from './reddit';
import { Comment } from './reddit/comment';

type Filter = (comment: Comment) => boolean;

export enum Event {
  COMMENTS = 'COMMENTS',
}

export interface Events {
  [Event.COMMENTS]: (comments: Comment[]) => void;
}

export class CommentWatcher {
  public static DEFAULT_SUBREDDIT = 'all';

  private reddit: Reddit;
  private filter?: Filter;
  private subreddit: string;
  private running: boolean = false;

  private emitter: Emitter = createNanoEvents<Events>();
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
        this.emitter.emit(Event.COMMENTS, comments);
      }
    }
  }

  stop() {
    this.running = false;
  }

  on<E extends keyof Events>(event: E, callback: Events[E]) {
    return this.emitter.on(event, callback);
  }
}
