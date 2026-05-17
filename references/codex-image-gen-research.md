# Codex Native Image Generation -- Research Output

**Investigation date:** 2026-05-18
**Question:** Can Codex generate images in-conversation (like ChatGPT does) so `/ttm-init` logo flow needs no API key on the Codex runtime?

## Findings

### Codex (OpenAI)

**Short answer: Yes -- Codex CLI has native in-conversation image generation via a built-in `image_gen` tool.**

**Capability confirmed.** As of 2025/2026, Codex CLI ships a built-in `image_gen` tool backed by `gpt-image-2`. This is the same image generation model OpenAI uses in ChatGPT. It works across the CLI, app, IDE extension, and cloud interfaces.

**Invocation patterns (three options):**

1. Natural language -- Codex auto-selects image generation when the intent is clear. Example: `codex "Generate a logo for my SaaS product"`.
2. Explicit skill mention using `$imagegen` in the prompt. Example: `codex "Create a square product icon $imagegen"`. This forces the built-in skill path.
3. From inside a SKILL.md -- the skill body instructs Codex to use the built-in `image_gen` tool. The tool is invoked implicitly from natural-language instructions inside the skill, not by a special frontmatter declaration. The sample imagegen SKILL.md in the Codex repo (`codex-rs/skills/src/assets/samples/imagegen/SKILL.md`) demonstrates this pattern: the instructions tell Codex to "use the built-in `image_gen` tool by default" and the runtime resolves it.

**API key requirement:** No separate API key required for the built-in path. It runs against whatever auth the user already has -- a ChatGPT Plus/Pro subscription is sufficient. Free plan does not include image generation. If `OPENAI_API_KEY` is set in the environment, the tool can route through the API instead (API pricing applies in that case).

**Output location:** Generated images land at `~/.codex/generated_images/` by default. Skills can instruct Codex to save to a specific path within the workspace.

**Key limitations:**
- Image turns consume plan limits 3-5x faster than text-only turns.
- Transparent PNG backgrounds are not supported in `gpt-image-2`. Transparency requires `gpt-image-1.5` plus a post-processing chroma-key script (`remove_chroma_key.py`) that ships with the imagegen skill. For a product logo, this matters if the user wants a transparent background.
- Rate cap: 250 images per minute across the API.
- The built-in `image_gen` tool is unavailable on Windows/WSL under the Azure OpenAI provider (unresolved as of the research date -- GitHub issue #19133). Direct OpenAI auth is unaffected.
- Resolution above 2560 x 1440 becomes unstable.

**Confidence:** Medium-high. The feature is documented on the official Codex developer site and confirmed by the sample SKILL.md in the openai/codex repo. The exact frontmatter syntax for declaring `image_gen` as an `allowed-tools` entry is not documented -- the tool appears to be automatically available to the imagegen skill rather than needing explicit declaration.

### Claude Code

Claude Code does not generate raster images natively. SVG-as-text is what Claude produces. Vision review uses the Read tool on saved image files.

### Recommended path per runtime

- **Claude Code:** SVG written directly by Claude as a text file. PNG conversion uses local tools (`rsvg-convert`, Inkscape headless, `sharp`). Vision review reads the generated PNG using the Read tool.
- **Codex:** Native image generation via the built-in `image_gen` tool is available and requires no API key (ChatGPT Plus/Pro subscription sufficient). The `/ttm-init` logo flow on Codex can therefore use `$imagegen` or natural-language image instructions directly, falling back to the SVG + local converter path only if the user is on the Free plan or the `image_gen` tool reports unavailable. The skill body should instruct Codex to save the generated PNG to the workspace path (e.g., `.taketomarket/brand/logo.png`) rather than relying on the default `~/.codex/generated_images/` location.

## Logo flow decision matrix

| Runtime | Generate | Render to PNG | Vision review |
|---|---|---|---|
| Claude Code | Inline SVG | Local converter (rsvg-convert, Inkscape, sharp) | Read tool on PNG |
| Codex | Native image_gen (gpt-image-2) -- fallback to inline SVG + local converter if unavailable | Native (image saved directly as PNG) -- fallback: local converter | Read tool on PNG |

## Sources

- https://developers.openai.com/codex/cli/features -- Codex CLI features page. Confirms built-in image generation, $imagegen invocation, API key optional, usage limits.
- https://github.com/openai/codex/blob/main/codex-rs/skills/src/assets/samples/imagegen/SKILL.md -- Official sample SKILL.md for imagegen. Shows that the skill body instructs use of the built-in image_gen tool; also covers fallback to scripts/image_gen.py with OPENAI_API_KEY.
- https://community.openai.com/t/introducing-gpt-image-2-available-today-in-the-api-and-codex/1379479 -- OpenAI announcement: gpt-image-2 launched in the API and Codex.
- https://developers.openai.com/codex/skills -- Codex skills documentation. Covers SKILL.md structure, optional agents/openai.yaml for tool dependencies; does not document image_gen in allowed-tools syntax.
- https://github.com/openai/codex/issues/19133 -- GitHub issue: built-in image_gen unavailable on Windows/WSL with Azure provider. Versions 0.120.0-0.123.0 affected; unresolved.
- https://codex.danielvaughan.com/2026/04/27/codex-cli-image-generation-gpt-image-2-visual-development-workflows/ -- Third-party deep dive. Documents three invocation patterns, rate limits, transparent background limitation, and output directory.
- https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan -- OpenAI help article. Confirms image generation not available on Free plan; Plus and Pro included.
- https://developers.openai.com/codex/changelog -- Codex changelog, consulted for feature availability timeline.
