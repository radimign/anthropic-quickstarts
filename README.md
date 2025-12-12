# Anthropic Quickstarts

Anthropic Quickstarts is a collection of projects designed to help developers quickly get started with building  applications using the Anthropic API. Each quickstart provides a foundation that you can easily build upon and customize for your specific needs.

## Getting Started

To use these quickstarts, you'll need an Anthropic API key. If you don't have one yet, you can sign up for free at [console.anthropic.com](https://console.anthropic.com).

## Quickstart

1. **Install dependencies**
   - Create a virtual environment and install the Python libraries used across the examples:
     ```bash
     python -m venv .venv
     source .venv/bin/activate
     pip install anthropic mcp
     ```
2. **Configure environment variables**
   - Copy the template and add your API key (and update the model if desired):
     ```bash
     cp .env.example .env
     echo "ANTHROPIC_API_KEY=your_api_key_here" >> .env
     echo "ANTHROPIC_MODEL=claude-3-7-sonnet-20250219" >> .env
     ```
   - Load the values into your shell: `export $(cat .env | xargs)`
3. **Run a sample interaction**
   - Ask Claude a quick question using the minimal agent implementation:
     ```bash
     python - <<'PY'
     from agents.agent import Agent
     from agents.tools.think import ThinkTool

     agent = Agent(
         name="Quickstart",
         system="You are a concise assistant.",
         tools=[ThinkTool()],
     )

     print(agent.run("Say hello in one sentence."))
     PY
     ```
4. **Expected output**
   - A one-sentence greeting from Claude printed to the console (e.g., `"Hello! I'm ready to help."`).
5. **Troubleshooting**
   - **Missing API key**: Ensure `ANTHROPIC_API_KEY` is present in `.env` and exported into your shell.
   - **Unsupported model**: If you see model errors, switch `ANTHROPIC_MODEL` to a currently available option such as `claude-3-5-sonnet-20241022`.

## Available Quickstarts

### Customer Support Agent

A customer support agent powered by Claude. This project demonstrates how to leverage Claude's natural language understanding and generation capabilities to create an AI-assisted customer support system with access to a knowledge base.

[Go to Customer Support Agent Quickstart](./customer-support-agent)

### Financial Data Analyst

A financial data analyst powered by Claude. This project demonstrates how to leverage Claude's capabilities with interactive data visualization to analyze financial data via chat.

[Go to Financial Data Analyst Quickstart](./financial-data-analyst)

### Computer Use Demo

An environment and tools that Claude can use to control a desktop computer. This project demonstrates how to leverage the computer use capabilities of the new Claude 3.5 Sonnet model.

[Go to Computer Use Demo Quickstart](./computer-use-demo)

### Simple CLI Chat

A minimalist Czech-language command line chat client for Claude. This project shows how to spin up a conversational experience in just a few lines of Python.

[Go to Simple CLI Chat Quickstart](./simple-cli-chat)

## General Usage

Each quickstart project comes with its own README and setup instructions. Generally, you'll follow these steps:

1. Clone this repository
2. Navigate to the specific quickstart directory
3. Install the required dependencies
4. Set up your Anthropic API key as an environment variable
5. Run the quickstart application

## Project structure

- `agents/` – minimal educational agent implementation (Python)
- `customer-support-agent/` – Claude-powered customer support Next.js app
- `financial-data-analyst/` – chat-based financial data exploration Next.js app
- `computer-use-demo/` – desktop computer control demo

## Explore Further

To deepen your understanding of working with Claude and the Anthropic API, check out these resources:

- [Anthropic API Documentation](https://docs.anthropic.com)
- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook) - A collection of code snippets and guides for common tasks
- [Anthropic API Fundamentals Course](https://github.com/anthropics/courses/tree/master/anthropic_api_fundamentals)

## Contributing

We welcome contributions to the Anthropic Quickstarts repository! If you have ideas for new quickstart projects or improvements to existing ones, please open an issue or submit a pull request.

## Community and Support

- Join our [Anthropic Discord community](https://www.anthropic.com/discord) for discussions and support
- Check out the [Anthropic support documentation](https://support.anthropic.com) for additional help

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
