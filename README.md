## Prokeep assignment -  Getting Started

I have also put this app up on my Github, if you prefer to clone it that way - https://github.com/ccahill1117/prokeep-parts-board

To run this app locally the first time (whether cloning or using .zip), do the following:

```bash

$ nvm use # 24.16.0
$ npm i 
$ npm run dev

```

Open [http://localhost:3000](http://localhost:3000) and you can see the contractor and distributor options (with ability to also see them side-by-side).

### Note: I would recommend the viewport to be about 1600px wide to best view the app

### The Data Model

- Fairly simple parts request data model

```javascript

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
```

### The Real-Time Scope

- Websockets are being used so any CRUD actions to the SQLite db are reflected right away in the views

### The Contractor/Distributor Boards

- There is some basic filtering here on both boards:
  - Filtering by category
  - Filtering by status
- The request cards show a few things:
  - Updated and Created at values (useful for prioritization)
  - Delete button on contractor side if the order is not filled/shipped
  - Delete is disabled if filled/shipped and contractor needs to reach out directly (helper text there to assist)
- Kept the contractor form really simple:
  - In the future there should probably be better guardrails on the form
    - Potential sql injection issues if not sanitized
  - Also just to keep within time restrictions, I did not make requests editable by the contractor
  - Similarly, I did not make requests archivavble, and would like to do that - so there is an archived view to make more room on the page
  - Force the filtering to go to all-types/all-statuses upon request submission 
    - That way, if filtering is applied, they see the new request upon submission, and not just a screen with no response
- Things I would do with a little more time: 
  - Fix up the views and sizing or the request cards to accomodate more information on screen (in side-by-side view the contractor side gets a little long once you have a few orders going)

### Error/Edge Cases
- I tried to keep complexity low so it's fun to click through
  - that also means with a lot of requests on the screen the app view gets a little weird

## Notes

- I used Claude Code to speed up development
- I have less experience with GraphQL so Claude was a big help there
- SQLite here is a great suggestion to get this installed quickly/easily for review
- .zip created with command: 
  - $ zip -r prokeep-parts-board.zip . -x "node_modules/*" -x ".next/*" -x ".git/*"

