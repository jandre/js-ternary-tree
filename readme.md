An (unoptimized) google-like autocomplete using a ternary search tree.  

## Example (requires node.js)

The example is kind of cute in that it uses the ternary tree on both the client and server side.  It builds its 'database' using the data in /example/data.
When a client is initiating a search, it will use an ajax request but if the # of results returned is < the requested amt (here, 500) then it will simply a local
ternary tree in the browser and search that instead. the client is not very smart because it will simply insert the items in order instead of trying to optimize it
for speed/space.

To run:

 * `cd example`
 * `node server.js`
 * `http://127.0.0.1:8080`


