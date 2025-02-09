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