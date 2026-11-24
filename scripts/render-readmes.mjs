import { readFile, writeFile } from 'node:fs/promises';

const { projects } = JSON.parse(await readFile(new URL('../docs/data/projects.json', import.meta.url), 'utf8'));
const check = process.argv.includes('--check');

function table(category, language) {
  const zh = language === 'zh';
  const rows = projects.filter((project) => project.category === category).map((project) => {
    const description = zh ? project.descriptionZh : project.description;
    const website = project.homepage ? ` · [${zh ? (project.id === 'cuvs' ? '文档' : '官网') : (project.id === 'cuvs' ? 'Documentation' : 'Website')}](${project.homepage})` : '';
    const tags = (zh ? project.tagsZh : project.tags) || [];
    const tagline = tags.length > 0 ? `<br>${tags.map((tag) => `\`${tag}\``).join(' ')}` : '';
    const maintainer = category === 'community' ? `${tagline}${zh ? ' · 由' : ' · Maintained by'} [@${project.maintainer}](https://github.com/${project.maintainer})${zh ? ' 维护' : ''}` : tagline;
    return `| <a href="${project.url}"><img src="${project.image}" width="240" alt="${project.name}"></a> | **[${project.name}](${project.url})**${website} — ${description}${maintainer} |`;
  });
  return `| ${zh ? '预览' : 'Preview'} | ${zh ? '项目' : 'Project'} |\n| :---: | --- |\n${rows.join('\n')}`;
}

const sections = [
  { file: 'README.md', heading: 'Community Projects', intro: 'Built by the community, for real OpenViking workflows.', category: 'community', language: 'en' },
  { file: 'README.md', heading: 'Partner Projects', intro: 'Projects collaborating with OpenViking across agent runtimes, storage, retrieval, and infrastructure.', category: 'partner', language: 'en' },
  { file: 'README.zh-CN.md', heading: '社区项目', intro: '来自社区，解决真实工作流里的问题。', category: 'community', language: 'zh' },
  { file: 'README.zh-CN.md', heading: '合作项目', intro: '覆盖智能体运行时、存储、检索和基础设施的合作项目。', category: 'partner', language: 'zh' }
];

let changed = false;
for (const section of sections) {
  const url = new URL(`../${section.file}`, import.meta.url);
  const original = await readFile(url, 'utf8');
  const marker = `<!-- PROJECTS:${section.category.toUpperCase()}:`;
  const expression = new RegExp(`(## ${section.heading}\\n\\n)[\\s\\S]*?(?=\\n## )`);
  const replacement = `$1${section.intro}\n\n${marker}START -->\n${table(section.category, section.language)}\n${marker}END -->`;
  if (!expression.test(original)) throw new Error(`Could not render ${section.heading} in ${section.file}`);
  const output = original.replace(expression, replacement);
  if (output !== original) {
    changed = true;
    if (check) {
      console.error(`${section.file} is out of date. Run npm run render.`);
      process.exitCode = 1;
    } else {
      await writeFile(url, output);
    }
  }
}
if (!check && changed) console.log('README files updated from docs/data/projects.json');
