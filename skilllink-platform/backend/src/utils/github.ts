import axios from 'axios';

export interface GitHubRepoInfo {
  name: string;
  description: string;
  owner: string;
  stars: number;
  forks: number;
  language: string;
  lastCommit: {
    message: string;
    date: string;
    author: string;
  };
  readme?: string;
}

export async function validateGitHubUrl(url: string): Promise<boolean> {
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
  return githubRegex.test(url);
}

export async function getRepoInfo(repoUrl: string): Promise<GitHubRepoInfo | null> {
  try {
    // Extract owner and repo from URL
    const match = repoUrl.match(/github\.com\/([\w-]+)\/([\w.-]+)/);
    if (!match) return null;

    const [, owner, repoName] = match;
    const cleanRepo = repoName.replace(/\.git$/, '');

    // GitHub API calls
    const [repoData, commitsData, readmeData] = await Promise.allSettled([
      axios.get(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
          })
        }
      }),
      axios.get(`https://api.github.com/repos/${owner}/${cleanRepo}/commits`, {
        params: { per_page: 1 },
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
          })
        }
      }),
      axios.get(`https://api.github.com/repos/${owner}/${cleanRepo}/readme`, {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
          })
        }
      })
    ]);

    if (repoData.status === 'rejected') return null;

    const repoDetails = repoData.value.data;
    const commits = commitsData.status === 'fulfilled' ? commitsData.value.data : [];
    const readme = readmeData.status === 'fulfilled' ? readmeData.value.data : '';

    const lastCommit = commits[0] || null;

    return {
      name: repoDetails.name,
      description: repoDetails.description || 'No description',
      owner: repoDetails.owner.login,
      stars: repoDetails.stargazers_count,
      forks: repoDetails.forks_count,
      language: repoDetails.language || 'Unknown',
      lastCommit: lastCommit ? {
        message: lastCommit.commit.message,
        date: lastCommit.commit.author.date,
        author: lastCommit.commit.author.name
      } : {
        message: 'No commits',
        date: '',
        author: ''
      },
      readme: typeof readme === 'string' ? readme.substring(0, 1000) : '' // First 1000 chars
    };
  } catch (error) {
    console.error('GitHub API error:', error);
    return null;
  }
}

export async function checkRepoOwnership(repoUrl: string, userGithubUsername: string): Promise<boolean> {
  try {
    const match = repoUrl.match(/github\.com\/([\w-]+)\/([\w.-]+)/);
    if (!match) return false;

    const [, owner] = match;
    return owner.toLowerCase() === userGithubUsername.toLowerCase();
  } catch (error) {
    return false;
  }
}
