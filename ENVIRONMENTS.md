# Environment Configuration

This project supports multiple environments with different API endpoints.

## Available Environments

| Environment     | API URL                             | Script          |
| --------------- | ----------------------------------- | --------------- |
| **Development** | `https://dev.extraexpertise.be/api` | `pnpm run dev`  |
| **QA**          | `https://qa.extraexpertise.be/api`  | `pnpm run qa`   |
| **Production**  | `https://app.extraexpertise.be/api` | `pnpm run prod` |

## Quick Start

```bash
# Development environment (default)
pnpm run dev

# QA environment for testing
pnpm run qa

# Production environment for final testing
pnpm run prod
```

## Detailed Usage

### Development

```bash
pnpm run dev
```

- Loads `.env.development`
- Starts dev server with development API
- Uses `https://dev.extraexpertise.be/api`

### QA Testing

```bash
pnpm run qa
```

- Loads `.env.qa`
- Starts dev server with QA API
- Uses `https://qa.extraexpertise.be/api`

### Production Preview

```bash
pnpm run prod
```

- Loads `.env.production`
- Starts dev server with production API
- Uses `https://app.extraexpertise.be/api`

## Build Commands

| Command               | Environment          | Purpose                         |
| --------------------- | -------------------- | ------------------------------- |
| `pnpm run build`      | Current `.env.local` | Standard build                  |
| `pnpm run build:qa`   | QA                   | Build for QA deployment         |
| `pnpm run build:prod` | Production           | Build for production deployment |

### QA Build

```bash
pnpm run build:qa
```

Builds the app with QA environment variables for deployment.

### Production Build

```bash
pnpm run build:prod
```

Builds the app with production environment variables for deployment.

## Environment Files Structure

```
├── .env.development     # Development environment variables
├── .env.qa             # QA environment variables
├── .env.production     # Production environment variables
├── .env.local          # Auto-generated (DO NOT COMMIT)
└── .env.example        # Template with all available variables
```

### File Contents

**`.env.development`**

```env
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=https://dev.extraexpertise.be/api
```

**`.env.qa`**

```env
NODE_ENV=qa
NEXT_PUBLIC_API_BASE_URL=https://qa.extraexpertise.be/api
```

**`.env.production`**

```env
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://app.extraexpertise.be/api
```

## How It Works

When you run `pnpm run [env]`, the system:

1. **Copies Environment File**: Copies the appropriate `.env.[environment]` file to `.env.local`
2. **Next.js Loads Variables**: Next.js automatically loads `.env.local`
3. **App Uses Variables**: The app uses the environment-specific API URL
4. **Centralized Management**: All image URLs and API calls use the centralized `getBaseUrl()` function

## Technical Implementation

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "cp .env.development .env.local && next dev --turbopack",
    "qa": "cp .env.qa .env.local && next dev --turbopack",
    "prod": "cp .env.production .env.local && next dev --turbopack",
    "build:qa": "cp .env.qa .env.local && next build",
    "build:prod": "cp .env.production .env.local && next build"
  }
}
```

### Environment Validation

The `src/env.js` file validates environment variables using Zod:

```javascript
export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_BASE_URL: z.string().url().default('https://dev.extraexpertise.be/api')
  },
  server: {
    NODE_ENV: z.enum(['development', 'qa', 'test', 'production']).default('development')
  }
});
```

### Centralized URL Management

All API and image URLs are managed through utility functions in `src/lib/utils/utilities.ts`:

```typescript
export const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://dev.extraexpertise.be/api';
};

export const getImageUrl = (imagePath: string): string => {
  return `${getBaseUrl()}/upload/${imagePath}`;
};
```

## Adding New Environment Variables

1. **Add to Environment Files**: Add the variable to all environment files (`.env.development`, `.env.qa`, `.env.production`)
2. **Update Example**: Update `.env.example` with documentation
3. **Add Validation**: Add validation to `src/env.js` if needed
4. **Update Components**: Use the environment variable in your components

Example:

```env
# Add to all environment files
NEXT_PUBLIC_NEW_FEATURE_URL=https://[env].extraexpertise.be/feature
```

## Troubleshooting

### Common Issues

**Environment not switching?**

- Check that `.env.local` was created and contains the correct values
- Restart the development server after switching environments

**API calls failing?**

- Verify the API URLs are accessible
- Check network connectivity to the specific environment

**Build failing?**

- Ensure all required environment variables are present in the target environment file
- Check that `src/env.js` validation passes

### Debugging

Check current environment:

```bash
# Check what's in .env.local
cat .env.local

# Verify environment in browser console
console.log(process.env.NEXT_PUBLIC_API_BASE_URL)
```

## Best Practices

1. **Never commit `.env.local`** - It's auto-generated and environment-specific
2. **Keep environment files in sync** - Ensure all files have the same variable names
3. **Use descriptive comments** - Document what each variable does
4. **Test environment switching** - Verify API calls work in each environment
5. **Validate before deployment** - Run build commands to ensure everything works
