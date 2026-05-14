# Daily Flow / 每日流

> A tiny local-first task rhythm tool, built from a real personal workflow with AI-assisted development.
>
> 一个由真实个人需求驱动、在 Codex 协助下开发的轻量每日任务与节奏管理小工具。

## Project Name / 项目名称

**daily-flow**

Display name: **Daily Flow**.

中文名可以理解为：**每日流**。

## Overview / 项目简介

Daily Flow is a small web tool for lightweight personal task planning. It is not a project management system. It is designed for people who want to quickly record what needs to be done, see what is coming up, and mark things as done with very little overhead.

The interface uses four rolling time windows:

- `7D` — within a week
- `15D` — within half a month
- `30D` — within a month
- `90D` — within a quarter

Each task appears only in the nearest matching window. Overdue tasks stay in `7D` with a small red warning dot.

Daily Flow 是一个轻量的个人任务节奏管理网页工具。它不是复杂的项目管理系统，而是帮助用户快速记录要做的事、查看接下来一段时间的任务，并用很低的维护成本完成每日管理。

界面采用四个滚动时间窗口：

- `7D` — 一周内
- `15D` — 半月内
- `30D` — 一月内
- `90D` — 季度内

每个任务只会出现在最临近的一个时间窗口中。逾期任务会留在 `7D` 中，并显示一个红色提示点。

## Screenshot / 项目截图

![Daily Flow Screenshot](screenshots/daily-flow-demo.png)

## Why I Built It / 为什么做这个项目

This project started from a real need: I wanted a simple tool that helped me keep track of tasks without becoming another system to maintain.

Many task and calendar apps are powerful, but they often ask for too much structure: projects, labels, priorities, workflows, time blocks, and dashboards. For my daily work, I needed something simpler:

- write down the task;
- set a date;
- see it in the right time window;
- click once when it is done.

Daily Flow is the first open-source project in my AI-assisted tool lab. The product direction, usage context, and iteration feedback came from my own real workflow, and the implementation was completed with help from Codex.

这个项目来自一个真实需求：我希望有一个工具可以帮我记住任务，但它本身不能变成新的负担。

很多任务管理和日历工具功能很强，但也经常要求用户维护太多结构：项目、标签、优先级、流程、时间块、看板。对我的日常工作来说，我更需要一个简单的东西：

- 写下任务；
- 设定日期；
- 自动出现在对应时间窗口里；
- 做完后点一下。

Daily Flow 是我 AI-assisted tool lab 中的第一个开源项目。产品方向、使用场景和迭代反馈都来自我的真实工作流，代码实现过程由 Codex 协助完成。

## Features / 功能特点

- Four rolling time windows: `7D`, `15D`, `30D`, `90D`
- One-click task completion
- Completed tasks remain visible for the current day, then move out of the main board
- Completed task view for the last 15 days
- Lightweight notes hidden behind a small icon
- Quick due date adjustment and window movement
- Local-first data storage with `localStorage`
- No backend, no build step, no account required

功能特点：

- 四个滚动时间窗口：`7D`、`15D`、`30D`、`90D`
- 任务一键完成
- 当天完成的任务会继续显示，第二天从主界面移出
- 可查看最近 15 天已完成任务
- 支持轻量备注，默认不占用列表空间
- 支持快速调整日期、移动任务到不同时间窗口
- 数据保存在浏览器 `localStorage`
- 无后端、无构建步骤、无需账号

## How to Use / 使用方式

### Use locally / 本地使用

1. Download or clone this repository.
2. Open `index.html` in your browser.
3. Click `Add` to create a task.
4. Set a due date.
5. Click the checkbox when the task is done.

步骤：

1. 下载或克隆本仓库；
2. 用浏览器打开 `index.html`；
3. 点击 `Add` 新增任务；
4. 设置截止日期；
5. 完成后点击任务前面的复选框。

### Use with GitHub Pages / 使用 GitHub Pages

This project is suitable for GitHub Pages because it is a pure static site.

本项目是纯静态网页，适合部署到 GitHub Pages。

After deployment, the live demo URL will usually look like:

```text
https://<your-github-username>.github.io/daily-flow/
```

部署后，在线演示地址通常类似：

```text
https://lucan-y.github.io/daily-flow/
```

## Tech Stack / 技术栈

- HTML
- CSS
- Vanilla JavaScript
- Browser `localStorage`

No external JavaScript libraries are used.

本项目没有使用外部 JavaScript 依赖。

## Data and Privacy / 数据与隐私说明

Daily Flow stores task data in your browser's `localStorage` under this key:

```text
daily-flow.tasks.v1
```

The data stays in the browser you use. It is not uploaded anywhere by this app.

Important notes:

- Clearing browser data may delete your tasks.
- Data is not synced across browsers or devices.
- If you deploy this on GitHub Pages, each visitor's data is still stored only in their own browser.

Daily Flow 使用浏览器 `localStorage` 保存任务数据，键名为：

```text
daily-flow.tasks.v1
```

数据只保存在当前浏览器中，本应用不会上传这些数据。

需要注意：

- 清理浏览器数据可能会删除任务；
- 数据不会跨浏览器或跨设备同步；
- 即使部署到 GitHub Pages，每个访问者的数据也只保存在自己的浏览器中。

## About AI-assisted Development / 关于 AI 辅助开发

This project was built through a human-led, AI-assisted process.

The product idea, usage scenario, simplification decisions, and iteration feedback came from a real user workflow. Codex helped with implementation, refactoring, documentation, and packaging the project for open-source release.

I see this project as a small example of how a non-professional software idea can become a working tool through conversation, iteration, and AI-assisted coding.

本项目采用“人主导，AI 协助”的方式完成。

真实需求、使用场景、产品取舍和迭代反馈来自用户本人；Codex 参与了代码实现、重构、文档整理和开源发布前的项目打包。

我把它看作一个小例子：一个普通用户的真实想法，可以通过对话、迭代和 AI 编程工具，逐步变成一个可以运行的小工具。

## Roadmap / 后续可能迭代方向

Possible future ideas:

- Import/export tasks as JSON
- Optional daily focus mode
- Better mobile layout
- Optional theme settings
- Lightweight reminder support
- Desktop app version

后续可能方向：

- 支持 JSON 导入/导出
- 增加可选的每日专注视图
- 优化移动端布局
- 增加可选主题设置
- 探索轻量提醒能力
- 打包成桌面应用

## License / 开源协议

MIT License.

See [LICENSE](./LICENSE).
