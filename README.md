# Real-Time USDT Dashboard
![Current-Dashboard](image.png)

## To Run

1. Clone the repo
2. Install dependencies
```bash 
pnpm install
```
3. Start dozer live (if you want to use dozer run, change the port in DozerProvider component)
```bash
dozer live
```
4. Run the dev server
```bash
pnpm run dev
```

## To-Do

-  Currently only count syncs in real time, need to make TradedVolume and Buyer/Seller tables reflect changes in real time. They currently only update on page refresh.

- Change time period if above changes stable.

- Find a way to merge on chain and off chain data.