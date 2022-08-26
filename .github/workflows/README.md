[About workflows](https://docs.github.com/en/actions/using-workflows/about-workflows)

A workflow is a configurable automated process that will run one or more jobs. Workflows are defined by a YAML file checked in to your repository and will run when triggered by an event in your repository, or they can be triggered manually, or at a defined schedule.


### [Composite Actions](https://docs.github.com/en/actions/creating-actions/creating-a-composite-action)

- Combine setup, login, and run steps into a single action


### [Reusable Workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows)

#### What?

Reuse workflows across multiple repositories by calling them.

#### Why?
- Eaier to maintain
- Create workflows more quickly
- Avoid duplication. DRY(don't repear yourself).
- Build consistently across multiple, dozens, or even hundreds of repositories
- Require specific workflows for specific deployments

#### How?
- Modify the repo settings so the workflows are accessible to the rest of the org.
- add the `workflow_call` as a workflow trigger.
- reference the workflow from another workflow using `uses: USER_OR_ORG_NAME/REPO_NAME/.github/workflows/REUSABLE_WORKFLOW_FILE.yml@TAG_OR_BRANCH`

## Good For
- Syncing many repos that are essentially built or developed in the same way.
- Ensure certain steps are followed for a specific deployment type.
- Implementing OIDC
- Abstracting away complexity


## News
- [GitHub Actions: Improvements to reusable workflows](https://github.blog/changelog/2022-08-22-github-actions-improvements-to-reusable-workflows-2/)
- [GitHub Actions: Inputs unified across manual and reusable workflows](https://github.blog/changelog/2022-06-10-github-actions-inputs-unified-across-manual-and-reusable-workflows/)
- [GitHub Actions: Simplify using secrets with reusable workflows](https://github.blog/changelog/2022-05-03-github-actions-simplify-using-secrets-with-reusable-workflows/)
- [How to start using reusable workflows with GitHub Actions](https://github.blog/2022-02-10-using-reusable-workflows-github-actions/)
- [GitHub Actions: Reusable workflows can be referenced locally](https://github.blog/changelog/2022-01-25-github-actions-reusable-workflows-can-be-referenced-locally/)
- [GitHub Actions: reusable workflows is generally available](https://github.blog/2021-11-29-github-actions-reusable-workflows-is-generally-available/)
