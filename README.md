# Task
Customizable Caching API
Task: Create an API layer with the following endpoints:

    - POST /cache → Stores a key-value pair.

    - GET /cache/{key} → Retrieves a value (if exists).

    - DELETE /cache/{key} → Remove from cache.

Requirements:

```
It should have a predefined max size. e.g. If max size is set to 10, no more items should be stored further and future POST requests should return an error. 
```

# Deployed API Link
[API Link](https://my-cache-r4kn.onrender.com)
for API documentation please visit [API Documentation](https://my-cache-r4kn.onrender.com/doc)
# Setup locally
1. Clone the repository
```
git clone git@github.com:dexter-ifti/my-cache.git
```
```bash
configure `.env` file like `.env.example`
```
`
if you want to use redis locally then in cache.js simply create a new instance of redis client like this
`
```javascript
const redisClient = redis.createClient();
```
2. Run `npm install`
3. Run `npm run dev`


<!-- GitAds-Verify: 3DPQFHT78C9CA1BXT7T7T67C72NPXY1I -->
