[Syntax for custom slash commands](https://docs.github.com/en/early-access/github/save-time-with-slash-commands/syntax-for-custom-slash-commands)

> **Note**
> Slash commands are currently in beta and subject to change. During the beta, only certain users can use slash commands in certain repositories. To add more users or repositories, contact the GitHub representative who added you to the beta.

You can create a custom slash command by adding a YAML file to the `/.github/commands` directory in a repository. The file defines how to invoke the slash command, where people can use the slash command, and a set of command steps for the slash command to perform.