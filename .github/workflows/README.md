# GitHub Actions CI/CD Documentation

This directory contains GitHub Actions workflows for automated testing, building, and deployment of the Planeswalker's Primer application.

## Workflows Overview

### 🧪 `test.yml` - Test Suite
Runs on every push and pull request to ensure code quality.

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main`

**Jobs:**
1. **Backend Tests** - Runs Jest tests with PostgreSQL
2. **Frontend Tests** - Runs React component and integration tests
3. **Build Check** - Verifies the application builds successfully
4. **Lint Check** - Runs ESLint on frontend code
5. **Security Check** - Audits npm dependencies for vulnerabilities

### 🚀 `deploy.yml` - Production Deployment
Deploys the application to production environments.

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**Jobs:**
1. **Test** - Runs full test suite
2. **Deploy Backend** - Deploys to Railway
3. **Deploy Frontend** - Deploys to Vercel
4. **Post Deployment** - Health checks and verification
5. **Rollback on Failure** - Handles failed deployments

### 👀 `preview.yml` - PR Preview Deployments
Creates preview deployments for pull requests.

**Triggers:**
- Pull request opened, synchronized, or reopened

**Features:**
- Creates unique preview URL for each PR
- Runs Lighthouse performance tests
- Comments results on the PR
- Updates deployment status

### 📦 `dependencies.yml` - Dependency Management
Automated dependency updates and security monitoring.

**Triggers:**
- Weekly schedule (Mondays at 9am UTC)
- Manual workflow dispatch

**Features:**
- Checks for outdated dependencies
- Runs security audits
- Creates PRs for updates
- Creates issues for critical vulnerabilities

## Required Secrets

Add these secrets to your GitHub repository settings:

### Railway Deployment
- `RAILWAY_TOKEN` - Your Railway API token

### Vercel Deployment
- `VERCEL_TOKEN` - Your Vercel API token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

## Environment Variables

The workflows use these environment variables:

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (test/production)

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Workflow Status Badges

Add these badges to your README:

```markdown
[![Test Suite](https://github.com/[username]/Capstone/actions/workflows/test.yml/badge.svg)](https://github.com/[username]/Capstone/actions/workflows/test.yml)
[![Deploy to Production](https://github.com/[username]/Capstone/actions/workflows/deploy.yml/badge.svg)](https://github.com/[username]/Capstone/actions/workflows/deploy.yml)
```

## Local Testing

To test workflows locally, use [act](https://github.com/nektos/act):

```bash
# Install act
brew install act

# Test the test workflow
act -W .github/workflows/test.yml

# Test with specific event
act pull_request -W .github/workflows/preview.yml
```

## Troubleshooting

### Common Issues

1. **Tests failing in CI but passing locally**
   - Check environment variables
   - Ensure database migrations run
   - Verify Node.js version matches

2. **Deployment failures**
   - Check service tokens are valid
   - Verify environment variables
   - Check service quotas/limits

3. **Preview deployments not working**
   - Ensure Vercel project is linked
   - Check PR permissions
   - Verify branch protection rules

### Debugging Steps

1. Check workflow run logs in Actions tab
2. Download artifacts for detailed test results
3. Re-run jobs with debug logging enabled
4. Check service dashboards (Railway/Vercel)

## Best Practices

1. **Keep workflows DRY** - Use reusable workflows where possible
2. **Cache dependencies** - Speeds up workflow runs
3. **Use environments** - Separate staging/production deployments
4. **Monitor costs** - GitHub Actions minutes and service usage
5. **Regular updates** - Keep actions up to date

## Workflow Customization

### Adding New Tests

Edit `test.yml` and add a new job:

```yaml
new-test:
  name: New Test Suite
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - name: Run new tests
      run: npm run test:new
```

### Adding Deployment Environments

1. Create environment in GitHub settings
2. Add environment protection rules
3. Update `deploy.yml` with environment

### Custom Notifications

Add notification steps to workflows:

```yaml
- name: Notify Slack
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Security Considerations

1. **Never commit secrets** - Use GitHub Secrets
2. **Limit permissions** - Use least privilege principle
3. **Review PR workflows** - Prevent malicious code execution
4. **Audit logs** - Regularly review workflow runs
5. **Update actions** - Keep third-party actions current

## Performance Optimization

1. **Matrix builds** - Test multiple versions in parallel
2. **Conditional jobs** - Skip unnecessary work
3. **Artifact caching** - Cache dependencies and build outputs
4. **Concurrent limits** - Prevent resource exhaustion
5. **Job timeouts** - Prevent hanging workflows

## Monitoring and Alerts

- GitHub Actions usage: Settings → Actions → Usage
- Workflow run history: Actions tab
- Email notifications: User settings → Notifications
- Status page: https://www.githubstatus.com

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Railway CI/CD Guide](https://docs.railway.app/guides/ci-cd)
- [Vercel CI/CD Integration](https://vercel.com/docs/concepts/git)
- [act - Local GitHub Actions](https://github.com/nektos/act)