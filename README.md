# WebSocket Server

This is websocket server

## How to run locally ?

**1.Clone the repo**

```bash 
git clone https://github.com/Virajb19/Websocket-server
cd Websocket-server
```
**2. Install dependencies**

```bash
npm install
```

**3. Run the server**

```bash
npm run dev
```
**4. Create .env and add environment variables**

Refer .env.example

**5. Start REDIS**

pull redis image

```bash
docker pull redis
```
Run redis container

```bash
docker run --name redis-local -p 6379:6379 -d redis
```