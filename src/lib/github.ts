import { github } from './site';

export type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  pushedAt: string;
  url: string;
};

export type Contributions = {
  total: number;
  /** Flat list of days, oldest first, each 0–4. */
  days: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[];
  currentStreak: number;
  longestStreak: number;
};

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#3776AB',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Shell: '#89E051',
  HTML: '#E34C26',
  CSS: '#563D7C',
};

export const languageColor = (lang: string | null) => (lang && LANG_COLORS[lang]) || '#8C9BB5';

/**
 * Top repositories by recent activity. Public REST endpoint — no token needed.
 * Returns null on any failure so the UI can degrade honestly instead of inventing data.
 */
export async function getRepos(limit = 3): Promise<Repo[] | null> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${github.username}/repos?sort=pushed&per_page=${limit}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
        },
        next: { revalidate: github.revalidateSeconds },
      },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as Array<Record<string, unknown>>;
    return json.map((r) => ({
      name: String(r.name),
      description: (r.description as string) ?? null,
      language: (r.language as string) ?? null,
      stars: Number(r.stargazers_count ?? 0),
      pushedAt: String(r.pushed_at),
      url: String(r.html_url),
    }));
  } catch {
    return null;
  }
}

/**
 * Contribution calendar. Requires a read-only PAT in GITHUB_TOKEN because the
 * REST API does not expose contributions — only GraphQL does.
 */
export async function getContributions(): Promise<Contributions | null> {
  if (!process.env.GITHUB_TOKEN) return null;
  const query = `query($login:String!){
    user(login:$login){
      contributionsCollection{
        contributionCalendar{
          totalContributions
          weeks{ contributionDays{ date contributionCount contributionLevel } }
        }
      }
    }
  }`;

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { login: github.username } }),
      next: { revalidate: github.revalidateSeconds },
    });
    if (!res.ok) return null;

    const json = await res.json();
    const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return null;

    const levelMap: Record<string, 0 | 1 | 2 | 3 | 4> = {
      NONE: 0,
      FIRST_QUARTILE: 1,
      SECOND_QUARTILE: 2,
      THIRD_QUARTILE: 3,
      FOURTH_QUARTILE: 4,
    };

    const days = cal.weeks.flatMap((w: { contributionDays: Record<string, unknown>[] }) =>
      w.contributionDays.map((d) => ({
        date: String(d.date),
        count: Number(d.contributionCount),
        level: levelMap[String(d.contributionLevel)] ?? 0,
      })),
    );

    let current = 0;
    for (let i = days.length - 1; i >= 0 && days[i].count > 0; i--) current++;
    let longest = 0;
    let run = 0;
    for (const d of days) {
      run = d.count > 0 ? run + 1 : 0;
      if (run > longest) longest = run;
    }

    return {
      total: Number(cal.totalContributions),
      days,
      currentStreak: current,
      longestStreak: longest,
    };
  } catch {
    return null;
  }
}
