import { createNanoEvents, Emitter } from 'nanoevents';
import { Reddit } from './reddit';
import { Comment } from './reddit/comment';
import { wait } from './reddit/utils.js';

type Filter = (comment: Comment) => boolean;

export enum Event {
  COMMENTS = 'COMMENTS',
}

export interface Events {
  [Event.COMMENTS]: (comments: Comment[]) => void;
}

export class CommentWatcher {
  public static DEFAULT_SUBREDDIT = 'all';
  public static DEFAULT_MIN_TIME_BETWEEN_REQS = 0;
  public static DEFAULT_USE_PAGINATION = false;

  private reddit: Reddit;
  private filter?: Filter;
  private subreddit: string;
  private running: boolean = false;
  private minTimeBetweenReqs: number;
  private usePagination: boolean;

  private emitter: Emitter = createNanoEvents<Events>();

  constructor(options: {
    reddit: Reddit;
    subreddit: string;
    filter?: Filter;
    minTimeBetweenReqs?: number;
    usePagination?: boolean;
  }) {
    this.reddit = options.reddit;
    this.subreddit = options.subreddit || CommentWatcher.DEFAULT_SUBREDDIT;
    this.filter = options.filter;
    this.minTimeBetweenReqs =
      options.minTimeBetweenReqs || CommentWatcher.DEFAULT_MIN_TIME_BETWEEN_REQS;
    this.usePagination = options.usePagination || CommentWatcher.DEFAULT_USE_PAGINATION;
  }

  async start() {
    this.running = true;

    let before: string | undefined = undefined;
    let lastReqTime = 0;
    while (this.running) {
      const timeSinceLastReq = Date.now() - lastReqTime;
      if (timeSinceLastReq < this.minTimeBetweenReqs) {
        await wait(this.minTimeBetweenReqs - timeSinceLastReq);
      }

      lastReqTime = Date.now();
      let comments: Comment[] = await this.reddit.getComments({
        subreddit: this.subreddit,
        before,
      });

      if (this.usePagination && comments.length > 0) {
        before = 't1_' + comments[0].id;
      }

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
