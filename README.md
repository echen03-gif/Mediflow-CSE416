# Mediflow-CSE416 - Team Orange

Link: https://mediflow-lnmh.onrender.com

npm packages:

running npm install in client and server directory should install all packages

client:
- `axios`
- `react`
- `react-dom`
- `@mui/material`, `@emotion/react`, `@emotion/styled`
- `@fullcalendar/react`, `@fullcalendar/daygrid`
- `socket.io-client`
- `web-vitals`
- `sharp`

client testing:
- `cypress`

server:
- `cors`
- `express`
- `mongodb`
- `socket.io`


server testing:
- `supertest`
- `jest`

To update your branch to the most recent changes do the following:
(Do this before starting to work on your branch)

# Switches to main branch.
$ git checkout main
# Pulls current code in main branch.
$ git pull
# Switches to component branch
$ git checkout component branch
# merges component branch with main branch - Merge conflicts could happen.
$ git merge main

TO PUSH CHANGES:

1. push and commit to designated component branch branch
2. create and submit a pull request to merge your branch into main -> should be a button on github
3. resolve any merge conflicts if there are any
4. main should be updated with any changes made to that branch
