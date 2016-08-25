# Asynchronous-Node-Web-API-with-Redis-Caching

I created a Node Web API that comprises of 3 servers: 2 backend services called dog and cat and a main pet server that serves all api requests. I used MongoDB and Mongoose for the database which gets hit by the cat and dog servers. I also implemented the pet servers endpoints asynchronously and included Redis caching in the pet server to optimize performance. The program was written in typescript but the javascript files can be used to run the program using forever, or nodemon.
