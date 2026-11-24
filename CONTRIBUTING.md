# Contributing to Awesome OpenViking

Thanks for helping map the OpenViking ecosystem. Plugins, integrations, tools, tutorials, deployment recipes, and real-world applications are all welcome. Early experiments are welcome too; polish is less important than a useful idea and a working starting point.

## Before submitting

An entry should:

- have a meaningful connection to OpenViking;
- be publicly accessible and include a README or documentation;
- explain what it does and how someone can try it;
- be maintained by you, or submitted with a neutral description based on public information;
- avoid unsupported claims, promotional language, and require no private access to evaluate.

This list is for discovery, not endorsement. Entries may be edited for clarity or removed when they become unavailable, abandoned, or unsafe.

## Add a project

1. Fork this repository and create a branch.
2. Add one object to [`docs/data/projects.json`](docs/data/projects.json). Use `community` for community work and `partner` for established OpenViking partner projects.
3. Write a concise English description and a Chinese `descriptionZh`. Lead with what the project lets someone do, then mention the OpenViking connection. Avoid “best”, “revolutionary”, and similar claims.
4. Add two to four useful tags. Projects listed under `community` also take an optional `tagsZh` array with the Chinese tag names; without it the Chinese README shows the entry without tags. Save a 1200 × 600 project preview as `docs/images/projects/<project-id>.png`. The repository's GitHub OpenGraph image is a good default; use a project screenshot when it communicates the work better.
5. Run the checks:

   ```sh
   npm run render
   npm test
   ```

6. Commit both the JSON and generated README changes, then open a pull request.

Do not edit the generated project tables in `README.md` or `README.zh-CN.md` directly. The JSON file is the shared source for both READMEs and the website.

## Pull request checklist

- [ ] The project has a clear OpenViking connection.
- [ ] Links work and the project is publicly accessible.
- [ ] Descriptions are specific, neutral, and supplied in English and Chinese.
- [ ] The entry is in the appropriate category.
- [ ] `npm run render` and `npm test` pass.
- [ ] You can respond to questions about the submission.

One project per pull request keeps review simple. For a correction or removal, open an issue or a focused pull request with the reason.
