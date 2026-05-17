---
name: ttm-brand-refresh
description: >
  Update BRAND.md with new proof points and deprecate expired ones.
  Use when brand evidence or voice guidelines need updating.
disable-model-invocation: true
allowed-tools: Read Write Bash Glob Grep
---

# /ttm-brand-refresh

Read and follow the workflow at `${CLAUDE_PLUGIN_ROOT}/workflows/reference-mgmt/brand-refresh.md`

This command will:
- Review current BRAND.md proof points for freshness
- Accept new proof points and evidence from the user
- Deprecate expired or outdated brand claims
- Update voice and tone guidelines if needed
- Validate changes against POSITIONING.md invariant

## Next steps

See `${CLAUDE_PLUGIN_ROOT}/templates/next-step-footer.md`.
<!-- next-step-footer -->
