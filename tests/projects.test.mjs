import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const data = JSON.parse(await readFile(new URL('../docs/data/projects.json', import.meta.url), 'utf8'));
const html = await readFile(new URL('../docs/index.html', import.meta.url), 'utf8');
const app = await readFile(new URL('../docs/app.js', import.meta.url), 'utf8');

test('project IDs and repositories are unique', () => {
  assert.equal(new Set(data.projects.map((p) => p.id)).size, data.projects.length);
  assert.equal(new Set(data.projects.map((p) => p.repository.toLowerCase())).size, data.projects.length);
});

test('all entries have complete, valid content', async () => {
  for (const project of data.projects) {
    assert.match(project.id, /^[a-z0-9-]+$/);
    assert.match(project.repository, /^[\w.-]+\/[\w.-]+$/);
    assert.equal(project.url, `https://github.com/${project.repository}`);
    assert.ok(['community', 'partner'].includes(project.category));
    assert.ok(project.description.length >= 50 && project.description.length <= 300);
    assert.ok(project.descriptionZh.length >= 20 && project.descriptionZh.length <= 180);
    assert.ok(project.tags.length >= 2 && project.tags.length <= 4);
    if (project.tagsZh) {
      assert.equal(project.tagsZh.length, project.tags.length);
      for (const tag of project.tagsZh) assert.ok(typeof tag === 'string' && tag.length > 0);
    }
    assert.ok(project.maintainer.length > 0);
    assert.equal(project.image, `images/projects/${project.id}.png`);
    const image = await readFile(new URL(`../docs/${project.image}`, import.meta.url));
    assert.ok(image.length > 10_000, `${project.id} preview image is missing or empty`);
    for (const url of [project.url, project.homepage].filter(Boolean)) {
      assert.ok(URL.canParse(url), `${project.id} contains an invalid URL`);
      assert.equal(new URL(url).protocol, 'https:');
    }
  }
});

test('initial required projects are present', () => {
  const repositories = new Set(data.projects.map((p) => p.repository));
  for (const repository of ['bytedance/deer-flow', 'NoKV-Lab/NoKV', 'loopx-project/loopx', 'NousResearch/hermes-agent', 'NVIDIA/cuvs', 'zrwangems/dsh-openviking-expand']) {
    assert.ok(repositories.has(repository), `Missing ${repository}`);
  }
});

test('Chinese README shows each project\'s own Chinese tags', async () => {
  const zhReadme = await readFile(new URL('../README.zh-CN.md', import.meta.url), 'utf8');
  for (const project of data.projects.filter((entry) => entry.tagsZh)) {
    const row = zhReadme.split('\n').find((line) => line.includes(`(${project.url})`));
    assert.ok(row, `Missing Chinese README row for ${project.id}`);
    for (const tag of project.tagsZh) {
      assert.ok(row.includes(`\`${tag}\``), `${project.id} Chinese row is missing tag ${tag}`);
    }
  }
});

test('website is self-contained apart from documented remote assets', () => {
  assert.match(app, /data\/projects\.json/);
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /class="skip-link"/);
  assert.doesNotMatch(html, /<script(?![^>]*src=)/);
});
