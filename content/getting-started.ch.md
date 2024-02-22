# Quick Start

In this tutorial you will add Inngest to a Next.js app to see how easy it can be to build complex workflows.

Inngest makes it easy to build, manage, and execute reliable workflows. Some use cases include scheduling drip marketing campaigns and payment flows, or chaining LLM interactions.

By the end of this ten-minute tutorial you will:

- Set up and run Inngest on your machine.
- Write your first Inngest function.
- Trigger your function from code and Inngest Dev Server.

### !!steps

In this tutorial you can use any existing Next.js project, or you can create a new one.

Run the following command in your terminal to create a new Next.js project:

```bash
npx create-next-app@latest --ts --eslint --tailwind --src-dir --app --import-alias='@/*' inngest-guide
```

Open the chosen project in your code editor and start your Next.js app in development mode by running:

```bash
npm run dev
```

### /

## 1. Install Inngest

With the Next.js app now running running open a new tab in your terminal. In your project directory's root, run the following command to install Inngest SDK:

### !!steps Install Inngest

```bash
npm install inngest
```

### /

## 2. Run Inngest Dev Server

Next, start the [Inngest Dev Server](https://www.inngest.com/docs/local-development#inngest-dev-server), which is a fast, in-memory version of Inngest where you can quickly send and view events events and function runs:

### !!steps Install Inngest

Next, start the Inngest Dev Server, which is a fast, in-memory version of Inngest where you can quickly send and view events events and function runs:

```bash
npx inngest-cli@latest dev
```

In your browser open [http://localhost:8288](http://localhost:8288) to see the development UI where later you will test the functions you write:

![!preview Inngest Dev Server](/dev-server.png)

### !!steps Create an Inngest client

Inngest invokes your functions securely via an API endpoint at **/api/inngest**. To enable that, you will create an [Inngest client](https://www.inngest.com/docs/reference/client/create) in your Next.js project, which you will use to send events and create functions.

Make a new directory next to your **app** directory (for example, **app/src/inngest**) where you'll define your Inngest functions and the client.

In this directory create a file, **client.ts** and create your first Inngest client to send and receive events.

```ts !! src/inngest/client.ts
import { Inngest } from "inngest"

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "my-app",
})
```

### !!steps Set up route handler

Set up a route handler for the **/api/inngest** route. Create a file inside your **app** directory (for example, at **src/app/api/inngest/route.ts**).

```ts !! src/app/api/inngest/route.ts
import { serve } from "inngest/next"
import { inngest } from "../../../inngest/client"

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! TODO this part needs to change. */
  ],
})
```

### !!steps Write your first Inngest function

In this step, you will write your first reliable serverless function. This function will be triggered whenever a specific event occurs (in our case, it will be **test/hello.world**). Then, it will sleep for a second and return a "Hello, World!".

Inside your **src/inngest** directory, create a new file called **functions.ts** where you will define Inngest functions. Add the following code:

```ts !! src/inngest/functions.ts
import { inngest } from "./client"

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s")
    return {
      event,
      body: "Hello, World!",
    }
  },
)
```

### !!steps Add the function to `serve()`

Next, import your Inngest function in the routes handler at **src/app/api/inngest/route.ts** and add it to the **serve** handler so Inngest can invoke it via HTTP.

> 👉 Note that you can import serve() for other frameworks and the rest of the code, in fact, remains the same — only the import statement changes (instead of inngest/next, it would be inngest/astro, inngest/remix, and so on). TODO create aside

```ts !! src/app/api/inngest/route.ts
import { serve } from "inngest/next"
import { inngest } from "../../../inngest/client"
import { helloWorld } from "../../../inngest/functions"

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld, // <-- This is where you'll always add all your functions
  ],
})
```

TODO Something about [client.ts](!src/inngest/client.ts#5), spotlink.

### !!steps Trigger your function from the development UI

#### Useful info

It is worth mentioning here that an event-driven approach allows you to:

- Trigger one or multiple functions from one event.
- Store received events for a historical record of what happened in your application.
- Use stored events to replay functions when there are issues in production.
- Interact with long-running functions by sending new events (cancel, wait for input, and other).

You will test your first event in two ways: by sending it directly to the Inngest UI, and then by triggering it from code.

With your Next.js and Inngest Dev Servers running, head over to Inngest Dev Server ([http://localhost:8288](http://localhost:8288)):

![!preview Inngest Dev Server](/dev-server.png)

### !!steps Send a test event

To send a test event, click on “Test Event” in the top right corner.

![!preview Inngest Dev Server](/dev-server-frame.png)

### !!steps Trigger from code

In the popup console, add the event name (which you defined in the `createFunction` (TODO make this highligtable in the code panels) method earlier) and some test metadata like an email address and press the "Send Event" button:

TODO this block of JSON needs to be copy-pastable from here—it doesn't show in the panels

```json
{
  "name": "test/hello.world",
  "data": {
    "email": "test-user@example.com"
  }
}
```

![!preview Inngest Dev Server](/dev-server-test-event-console.png)

### !!steps Inspect event logs locally

The event is sent to Inngest (which is running locally) and automatically executes your function in the background! You can see the new function's execution logged in the [stream tab](http://localhost:8288/stream).

![!preview Inngest Dev Server](/dev-server-event-1.png)

### !!steps Inspect an event's log

Click on the log to see more information about the event such as which function was triggered, its payload, output, and timeline.

![!preview Inngest Dev Server](/dev-server-event-details-1.png)

### !!steps The event inspection panel

In this example, the event triggered the `hello-world` function, which did sleep for a second and then returned "Hello, World!". Exactly as planned!

![!preview Inngest Dev Server](/dev-server-event-1-frames.png)

### !!steps Replay an event

If your event behaved in an odd way, you can either replay it or edit and replay it. Replaying a function can be really helpful in debugging the function errors locally. To try it, click on the "Replay" button in the top center.

![!preview Inngest Dev Server](/event-details-1-replay.png)

### !!steps Recording the stream of events

After the event is replayed, there are two events recorded in the dashboard.

![!preview Inngest Dev Server](/dev-server-event-2.png)

### !!steps Trigger an event from inside your app

To run functions reliably in your app, you'll need to send an event to Inngest. Once the event is received, it is forwarded to all functions that listen to it.

To send an event from your code, you can use the `Inngest` client's `send()` method. TODO: need to make it so backticks = code in MD

TODO this should live in an expandable "deep dive" block

With the `send()` method used below you now can:

- Send one or more events within any API route.
- Include any data you need in your function within the `data` object.
- In a real-world app, you might send events from API routes that perform an action, like registering users (for example, **app/- user.signup**) or creating something (for example, **app/report.created**).

You will now send an event from the “hello” Next.js API function. To do so, create a new API handler at the **src/app/api/hello/route.ts** file.

👉 Note that we use [force-dynamic](https://nextjs.org/docs/app/building-your-application/caching) to ensure we always send a new event on every request. In most situations, you'll probably want to send an event during a POST request so that you don't need this config option. TODO this should highlight "force-dynamic" in the code panel when you hover it. SPOTLINK!

```ts !! src/app/api/hello/route.ts
import { NextResponse } from "next/server"
import { inngest } from "../../../inngest/client" // Import our client

// Opt out of caching; every request should send a new event
export const dynamic = "force-dynamic"

// Create a simple async Next.js API route handler
export async function GET() {
  // Send your event payload to Inngest
  await inngest.send({
    name: "test/hello.world",
    data: {
      email: "testFromNext@example.com",
    },
  })

  return NextResponse.json({
    name: "Hello Inngest from Next!",
  })
}
```

### !!steps Test the Inngest event

Every time this API route is requested, an event is sent to Inngest. To test it, open [http://localhost:3000/api/hello](http://localhost:3000/api/hello). You should see the following output: `{"name":"Hello Inngest from Next!"}`.

TODO it would be great to show these local app screens in a 2 up next to the Inngest screen.

![!preview Local app](/hello-from-next.png)

### !!steps Check the Inngest event log

If you go back to the Inngest Dev Server, you will see this new event appear there as well:

![!preview Inngest Dev Server](/dev-server-event-3.png)

### !!steps Malformed events

However, what happens if you send a different event? Let's see! Change **test/hello.world** to **test/hello.bizarro.world** and refresh [http://localhost:3000/api/hello](http://localhost:3000/api/hello). You will see that the event was sent and received.

![!preview Inngest Dev Server](/dev-server-event-4.png)

### !!steps Check the Inngest event log

No functions were triggered because there is not a single function in your app that is listening to such a bizarre event:

![!preview Inngest Dev Server](/dev-server-event-4-details.png)

### !!steps Well done!

And - that's it! You now have learned how to create Inngest functions and you have sent events to trigger those functions. Congratulations 🥳

## Next Steps

To continue your exploration, feel free to check out:

- How to deploy your app to your platform.
- How to use Inngest with other frameworks.
- Docs page on writing functions.
- Docs page on writing scheduled functions.
- Docs page on sending events.

TODO needs a proper ending block for all these, not a step.
