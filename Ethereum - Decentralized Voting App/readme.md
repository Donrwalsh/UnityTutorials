- It is critical to run /node_modules/.bin/testrpc in a terminal window, despite this being unmentioned anywhere in the tutorial.
- Also note that the correct address (found via `deployedContract.address`) must be copied to index.js << Failing to do this will cause everything to run normally, but voting transactions will not increment as they are invalid.
- Ignore all startup instructions other than the bottom of the readme.
