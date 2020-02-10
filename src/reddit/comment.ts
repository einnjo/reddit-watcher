/*
E.g.
  id: 'fh6oqqc',
  name: 't1_fh6oqqc',
  author: 'AnimeMemeLord1',
  body: 'Decent...?',
  bodyHTML: '&lt;div class="md"&gt;&lt;p&gt;Decent...?&lt;/p&gt;\n&lt;/div&gt;',
  parentId: 't1_fh6lktq',
  nsfw: false,
  subredditId: 't5_315h3',
  subreddit: 'TokyoGhoul',
  isSubmitter: false,
  isPremium: false,
  link: {
    id: 't3_f1dui7',
    title: 'No one talks about Tokyo ghoul 👊💥 😂',
    author: 'litas-sidedude',
    permalink: 'https://www.reddit.com/r/TokyoGhoul/comments/f1dui7/no_one_talks_about_tokyo_ghoul/',
    url: 'https://i.redd.it/rscc10h2cyf41.jpg',
  },
  permalink: '/r/TokyoGhoul/comments/f1dui7/no_one_talks_about_tokyo_ghoul/fh6oqqc/',
  createdUTC: 1581302540,
*/
export class Comment {
  public static fromApiResponse(raw: { kind: 't1'; data: any }) {
    const data = raw.data;
    return new Comment({
      id: data.id,
      name: data.name,
      author: data.author,
      body: data.body,
      bodyHTML: data.body_html,
      parentId: data.parent_id,
      nsfw: data.over_18,
      subredditId: data.subreddit_id,
      subreddit: data.subreddit,
      isSubmitter: data.is_submitter,
      isPremium: data.author_premium,
      permalink: data.permalink,
      createdUTC: data.created_utc,
      link: {
        id: data.link_id,
        title: data.link_title,
        author: data.link_author,
        permalink: data.link_permalink,
        url: data.link_url,
      },
    });
  }

  public readonly id: string;
  public readonly name: string;
  public readonly author: string;
  public readonly body: string;
  public readonly bodyHTML: string;
  public readonly parentId: string;
  public readonly nsfw: boolean;
  public readonly subredditId: string;
  public readonly subreddit: string;
  public readonly isSubmitter: boolean;
  public readonly isPremium: boolean;
  public readonly link: Link;
  public readonly permalink: string;
  public readonly createdUTC: number;

  constructor(options: {
    id: string;
    name: string;
    author: string;
    body: string;
    bodyHTML: string;
    parentId: string;
    nsfw: boolean;
    subredditId: string;
    subreddit: string;
    isSubmitter: boolean;
    isPremium: boolean;
    link: Link;
    permalink: string;
    createdUTC: number;
  }) {
    this.id = options.id;
    this.name = options.name;
    this.author = options.author;
    this.body = options.body;
    this.bodyHTML = options.bodyHTML;
    this.parentId = options.parentId;
    this.nsfw = options.nsfw;
    this.subredditId = options.subredditId;
    this.subreddit = options.subreddit;
    this.isSubmitter = options.isSubmitter;
    this.isPremium = options.isPremium;
    this.link = options.link;
    this.permalink = options.permalink;
    this.createdUTC = options.createdUTC;
  }
}

interface Link {
  id: string;
  title: string;
  permalink: string;
  author: string;
  url: string;
}
