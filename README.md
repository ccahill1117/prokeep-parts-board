## Prokeep assignment -  Getting Started

I have also put this app up on my Github - https://github.com/ccahill1117/prokeep-parts-board

To run this app locally the first time, and create the necessary database:

```bash

$ nvm use # 24.16.0
$ npm i 
$ npm run dev

```

Open [http://localhost:3000](http://localhost:3000) and you can see the contractor and distributor options (with ability to also see them side-by-side).

## How it works

### The Data Model

- Fairly simple parts request data model

export type Category = 'hvac' | 'plumbing' | 'automotive'
export type Status = 'pending' | 'filled' | 'shipped'

export interface PartRequest {
  id: string
  category: Category
  partName: string
  quantity: number
  notes: string
  status: Status
  createdAt: string
  updatedAt: string
}

### The Real-Time Scope

- Websockets are being used so any CRUD actions to the SQLite db are reflected right away in the views

### The Contractor/Distributor Boards


### The GraphQL Schema

### Error/Edge Cases

## Notes

- I did use Claude Code to speed up development
- I have less experience with GraphQL so Claude was a big help there
- 

