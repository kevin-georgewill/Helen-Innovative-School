#!/usr/bin/env bash
# Apply HIS migrations to the remote Supabase project.
# Run this from the backend/ directory after linking the project.
set -euo pipefail

MIGRATIONS_DIR="$(dirname "$0")/migrations"
PROJECT_REF="uehmzcosgnkshnmoitmg"

echo "→ Linking to Supabase project $PROJECT_REF …"
supabase link --project-ref "$PROJECT_REF"

echo "→ Pushing migrations …"
supabase db push

echo "✓ All migrations applied."
