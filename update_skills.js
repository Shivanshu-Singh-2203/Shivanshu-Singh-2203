const fs = require('fs');
const axios = require('axios');

const username = 'Shivanshu-Singh-2203';
const skills = {
  "C++": ["cpp", "cplusplus"],
  "Python": ["python"],
  "JavaScript": ["javascript", "js"],
  "Linux CLI": ["linux", "bash", "shell"],
  "Git/GitHub": ["git", "github"],
  "Algorithms": ["algorithms", "data-structures"],
  "Web Dev": ["web", "html", "css", "javascript"]
};

const getContributions = async (topicList) => {
  let total = 0;
  for (const topic of topicList) {
    const res = await axios.get(`https://api.github.com/search/repositories?q=user:${username}+topic:${topic}`);
    for (const repo of res.data.items) {
      total += repo.stargazers_count + repo.forks_count + repo.open_issues_count;
    }
  }
  return Math.min(total, 100); // cap at 100%
};

(async () => {
  let readme = fs.readFileSync('README.md', 'utf8');

  for (const [skill, topics] of Object.entries(skills)) {
    const contributions = await getContributions(topics);
    const filled = '█'.repeat(Math.floor(contributions / 10));
    const empty = '░'.repeat(10 - Math.floor(contributions / 10));
    const badge = `![${skill} Progress](https://img.shields.io/badge/${encodeURIComponent(skill)}-[${filled}${empty}]-${contributions}%25-blue?style=for-the-badge)`;

    const regex = new RegExp(`!\\[${skill} Progress\\]\\(.*?\\)`, 'g');
    readme = readme.replace(regex, badge);
  }

  fs.writeFileSync('README.md', readme);
})();

