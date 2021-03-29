### Front End Development

In this project we are using [stylelint](https://stylelint.io), [eslint](https://eslint.org) and [prettier](https://prettier.io) to keep our code clean. To make development easier, you can install plugins for your text editor of choice for these linters.

### Ship Script

We have written a ship script in order to make running tests and pushing code up to github easier. Make sure you run this script after you have made your separate branch and commit messages.

This script will run all of the backend and frontend tests, as well as running your code against multiple linters, in order to enforce a specific code style. You can run this all manually yourself but this is automated.

Run the ship script in the root directory of the project with `./ship.sh`

### Code conventions

We follow XP practices including Test Driven Development (red/green/refactor) and paired programming. Our goal is to maintain 80% code coverage with our tests, so we strongly encourage you to test drive your code to help us with this goal. If you commit code and make a pull request, it will be reviewed by one of our Trusted Committers according to our code/styling/testing standards.

### Fork and Pull

For this repo we use a standard Fork and Pull contributing model. This is a good way to manage multiple, asynchronous contributors. Follow the steps in this article and you'll be on your way! https://help.github.com/articles/fork-a-repo/

Important: After forking, remember to set up a remote that points to the upstream repository to keep your forked repo up-to-date. See this article: https://help.github.com/articles/syncing-a-fork/

When you are ready to merge your change back in, open a Pull Request!

### Commit-message conventions

See Chris Beams excellent article on how to write good git commits: https://chris.beams.io/posts/git-commit/

### How to submit feature requests and bug reports

To submit a feature request or a bug, please open an issue.

### Helpful links, information, and documentation

See our [README](./README.md) for more information.
