import * as Axios from 'axios';
import querystring from 'querystring';

import { Comment } from './comment';
import { intercept401AndReauth } from './intercept-401-and-reauth';
import { intercept500AndRetry } from './intercept-500-and-retry';

const DEFAULT_AUTH_API_BASE_URL = 'https://www.reddit.com/api/v1';
const DEFAULT_API_BASE_URL = 'https://oauth.reddit.com';
const COMMENTS_ENDPOINT = '/r/all/comments';
const AUTH_ENDPOINT = '/access_token';

interface RedditOptions {
  user?: string;
  secret?: string;
  apiBaseUrl?: string;
  authApiBaseUrl?: string;
  userAgent?: string;
}

export class Reddit {
  private user: string;
  private secret: string;
  private apiBaseUrl: string;
  private authApiBaseUrl: string;
  private userAgent: string;
  private http: Axios.AxiosInstance;

  constructor(options: RedditOptions) {
    this.user = options.user || (process.env.REDDIT_USER as string);
    this.secret = options.secret || (process.env.REDDIT_SECRET as string);
    this.apiBaseUrl = options.apiBaseUrl || DEFAULT_API_BASE_URL;
    this.authApiBaseUrl = options.authApiBaseUrl || DEFAULT_AUTH_API_BASE_URL;
    this.userAgent = options.userAgent || (process.env.REDDIT_USER_AGENT as string);
    this.http = Axios.default.create({
      baseURL: this.apiBaseUrl,
      headers: {
        'User-Agent': this.userAgent,
      },
    });
    intercept401AndReauth(this.http, this.getToken.bind(this));
    intercept500AndRetry(this.http);
  }

  public async getComments(): Promise<Comment[]> {
    const response = await this.http.get(COMMENTS_ENDPOINT, {
      headers: {
        Accept: 'application/json',
      },
      params: {
        limit: 100,
      },
    });

    return response.data.data.children.map((child: any) => Comment.fromApiResponse(child));
  }

  private async getToken(): Promise<string> {
    const clientAuth = Buffer.from(`${this.user}:${this.secret}`).toString('base64');
    const response = await this.http.post(
      AUTH_ENDPOINT,
      querystring.stringify({
        grant_type: 'client_credentials',
      }),
      {
        baseURL: this.authApiBaseUrl,
        headers: {
          // tslint:disable-next-line: object-literal-key-quotes
          Authorization: 'Basic ' + clientAuth,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return response.data.access_token;
  }
}

export { Comment };
