# Starknet Subquery x Keyban

## Install

```bash
pnpm i
pnpm codegen
pnpm build
```

## Start

```bash
docker-compose up -d
```

## Restart

```bash
docker-compose down -v && rm -fr .data && pnpm codegen && pnpm build && docker-compose up -d
```

In case of issues with .data/postgres permissions or postgres restart issues, try:

```bash
docker-compose down -v && rm -fr .data && pnpm build && mkdir -p .data/postgres && sleep 20 && docker-compose up -d
```
