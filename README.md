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
