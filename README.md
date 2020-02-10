# Reddit Watcher

Allows you to watch 👀, filter 🕵, and act 🚀 on new reddit comments.

## Usage

```typescript
import { CommentWatcher } from '.';
import { Comment, Reddit } from './reddit';

// Initialize the reddit API client.
const reddit = new Reddit({
  user: 'YOUR_REDDIT_APP_USER',
  secret: 'YOUR_REDDIT_APP_SECRET',
  userAgent: 'your_app_name (by /u/your_reddit_username)',
});

// Filter for comments posted in /r/movies threads.
const filter = (comment: Comment) => comment.subreddit === 'movies';

// Log all matched comments to console.
const action = async (comments: Comment[]) => {
  for (const comment of comments) {
    console.log(`[${comment.subreddit}] ${comment.author} - ${comment.body}`);
  }
};

// Create a new watcher.
const watcher = new CommentWatcher({ reddit, filter, action });

// Watch him as he goes.
watcher.start();
```

![demo](https://gfycat.com/cheerfulpaltryaustralianfreshwatercrocodile)
