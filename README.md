# AI automation: Personalized outreach to new lead

This AI agent takes the email address of a new lead (from a waitlist, newsletter signup or lead magnet), researches the company (based on the email domain if it's from a business), drafts a personalized initial email outreach and hands it to a human.

## Use this agent in <5 minutes

Simply click the button below to deploy this AI agent to a Cloudflare worker. Then trigger it with an API call and find the results in your inbox at [gotohuman.com](https://www.gotohuman.com).

You'll need
- an [OpenAI API account](https://platform.openai.com/login?launch)
- a [Cloudflare account](https://www.cloudflare.com/) (Cloudflare's free plan allows this agent to run for up to 30 seconds each time).
- a [gotoHuman account](https://app.gotohuman.com) (to monitor the steps of your AI automation and receive the generated email suggestion)

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/gotohuman/demo-gth-cf-inbound)

- It will ask for your Cloudflare Account ID and API Token
  - Find it in the sidebar of your Cloudflare dashboard at __Workers&Pages__ > __Overview__
  - You'll need to have at least one Cloudflare worker for the sidebar to appear (simply select any template)
  - When creating the API Token, select the _Edit Cloudflare Workers_ token template for the right permissions

- After seeing the success page, click on the link for the __Worker dash__
  - Here you find your freshly deployed AI automation
  - Click it, go to __Settings__
    - Select __Variables__, click __Add variable__
      - Enter `OPENAI_API_KEY` as name and your API key from OpenAI as value (OpenAI Sidemenu > __API keys__). Click __Encrypt__ and __Add variable__
      - Enter `GTH_API_KEY` as name and your API key from gotoHuman as value (gotoHuman header bar > 🔑 icon). Click __Encrypt__
      - Click __Deploy__
    - Under __Triggers__ you find the API endpoint of your AI automation listed in __Routes__
      - e.g. `https://gth-cf-demo-inbound.mycfsubdomain.workers.dev`
- Call the API with an email query parameter
    - e.g. `https://gth-cf-demo-inbound.mycfsubdomain.workers.dev/?email=ada.lovelace@acme.org`
- Watch your AI automation do its job [in your gotoHuman inbox](https://app.gotohuman.com)
- Edit the AI automation in [src/index.js](src/index.js) to your needs, e.g. by [editing the instructions to the LLM](src/index.js#L76) (in this demo it is prompted to write a response for _Jack from Acme org_). You can edit the file right in the GitHub UI and commmit your changes. This will automatically trigger a new deploy of your updated AI automation.

## Extend automation
Check the [gotoHuman docs](https://docs.gotohuman.com) to see how you can easily adapt the code to __request human approval__ for further processing instead of just serving the generated results. You can then set up a __webhook__ that gets triggered upon approval.

Make your AI automation go full-circle while keeping the human in the loop.