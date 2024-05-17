# AI automation: Personalized outreach to new lead
## Use this agent in <5 minutes
This AI automation takes the email address of a new lead (from a waitlist or newsletter signup or a lead magnet), researches the company (based on the email domain if it's from a business) and drafts a tailored initial email response. 
It can be triggered via a simple API call to automate the workflow.
It's easy to customize the instructions to the LLM in the code here. When saved, it will then be automatically deployed to your Cloudflare worker and run with your changes from that point on.

Automatically fork this AI automation and deploy it to your own cloud.
You'll need
- an [OpenAI API account](https://platform.openai.com/login?launch)
- a Cloudflare account (Cloudflare's free plan allows this agent to run for up to 30 seconds each time).
- a gotoHuman account (to monitor the steps of your AI automation and receive the suggested email response)

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/gotohuman/demo-gth-cf-inbound)

- It will ask for your Cloudflare Account ID and API Token
  - Find it in the sidebar of your Cloudflare dashboard at __Workers&Pages__ > __Overview__
  - You'll need to have at least one Cloudflare worker (simply select any template) for the sidebar to appear
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