# Security Policy

## Supported Versions

| Version | Supported              |
| ------- | ---------------------- |
| 0.2.x   | ✅ Current             |
| 0.1.x   | ⚠️ Security fixes only |
| < 0.1   | ❌ Not supported       |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly.

### How to Report

1. **Do NOT** open a public GitHub issue for security vulnerabilities
2. Email security concerns to: [security@example.com] (or use GitHub's private vulnerability reporting)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Resolution Timeline**: Depends on severity
  - Critical: 24-48 hours
  - High: 1 week
  - Medium: 2-4 weeks
  - Low: Next release

### Disclosure Policy

- We follow responsible disclosure practices
- Security fixes are released as soon as possible
- Public disclosure after patch is available
- Credit given to reporters (unless anonymity requested)

## Security Best Practices

When contributing, please:

1. **Never commit secrets** - Use environment variables
2. **Validate all inputs** - Use `@repo/validators`
3. **Keep dependencies updated** - Run `pnpm upgrade:check` regularly
4. **Review security advisories** - Check `pnpm audit`

## Automated Security

This repository uses:

- **Dependabot** - Automated dependency updates
- **GitHub Security Advisories** - Vulnerability alerts
- **pnpm audit** - Dependency vulnerability scanning

Run security checks locally:

```bash
pnpm audit              # Check for vulnerabilities
pnpm upgrade:check      # Check for outdated packages
```
