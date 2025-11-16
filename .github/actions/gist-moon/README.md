# 🌙 Gist Moon Phase Action

GitHub Action that fetches the current moon phase from the U.S. Naval Observatory (USNO) API and updates a gist with a beautiful ASCII art representation.

## Features

- 🌑 Displays current moon phase (8 phases supported)
- 📊 Shows moon illumination percentage
- 🎨 5-line ASCII art graphic (60 columns)
- 🔄 Automatically updates a GitHub Gist
- 📍 Configurable location coordinates

## Usage

First, create a gist at https://gist.github.com/ and note the gist ID from the URL.

Then, add this action to your workflow:

```yaml
name: Update Moon Phase Gist

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:  # Manual trigger

jobs:
  update-gist:
    runs-on: ubuntu-latest
    steps:
      - uses: austenstone/.github/.github/actions/gist-moon@main
        with:
          gist_id: ${{ secrets.GIST_ID }}
          github_token: ${{ secrets.GH_TOKEN }}
          filename: 'moon.txt'
          latitude: '26.118461'
          longitude: '-80.158453'
          timezone: '-5'
```

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `gist_id` | ✅ Yes | - | GitHub Gist ID to update |
| `github_token` | ✅ Yes | - | GitHub token with `gist` scope |
| `filename` | No | `moon.txt` | Filename in the gist to update |
| `latitude` | No | `26.118461` | Latitude coordinate (Fort Lauderdale, FL) |
| `longitude` | No | `-80.158453` | Longitude coordinate (Fort Lauderdale, FL) |
| `timezone` | No | `-5` | Timezone offset from UTC (EST) |

## Outputs

| Output | Description |
|--------|-------------|
| `phase` | Current moon phase name (e.g., "Waning Crescent") |
| `illumination` | Moon illumination percentage (e.g., "18%") |
| `date` | Date of moon data (YYYY-MM-DD) |

## Setup

### 1. Create a Gist

Go to https://gist.github.com/ and create a new gist with any content. Note the gist ID from the URL.

### 2. Create a Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "Gist Moon Phase")
4. Select the `gist` scope
5. Generate and copy the token

### 3. Add Secrets to Your Repository

1. Go to your repository settings → Secrets and variables → Actions
2. Add `GIST_ID` with your gist ID
3. Add `GH_TOKEN` with your personal access token

## Example Output

```
CURRENT MOON (2025-11-15)
     /-----##\
    (      ###)
     \-----##/
Phase: Waning Crescent | Illumination: 18%
```

## Moon Phases Supported

- 🌑 New Moon
- 🌒 Waxing Crescent
- 🌓 First Quarter
- 🌔 Waxing Gibbous
- 🌕 Full Moon
- 🌖 Waning Gibbous
- 🌗 Third Quarter (Last Quarter)
- 🌘 Waning Crescent

## API

This action uses the [U.S. Naval Observatory Astronomical Applications API](https://aa.usno.navy.mil/data/api) to fetch moon phase data.

## License

MIT
