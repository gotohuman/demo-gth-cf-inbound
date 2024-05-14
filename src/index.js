/**
 * This is a demo AI workflow automation brought to you by gotoHuman

 * - Fetch your API key for OpenAI at https://platform.openai.com/account/api-keys
 * - Fetch your API key for gotoHuman at https://app.gotohuman.com
 * - Adapt to your needs
 * - Run at your own risk
 * 
 * Learn more at gotohuman.com
 */

import OpenAI from 'openai';
import cheerio from 'cheerio';
import GoToHuman from './gth';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    if (!email) return new Response("'email' query param missing", { status: 500 });
    ctx.waitUntil(triggerWorkflow(env.OPENAI_API_KEY, env.GTH_API_KEY, email));
    try {
      return new Response("Triggered AI workflow", { status: 200 });
    } catch (e) {
      console.error("Trigger Error", e)
      return new Response(e.message, { status: 500 });
    }
    
  },
};

async function triggerWorkflow(openAiKey, gthKey, email) {
  const openai = new OpenAI({
    apiKey: openAiKey,
  });
  const agentId = "com.gotohuman.tests.agent"
  const gth = new GoToHuman(gthKey, agentId)

  try {
    await gth.completedTask({name: "Prospect signed up", result: `Sender: ${email}`})

    const domain = email.split('@').pop();

    const regex = createDomainRegex();
    let urlToCheck, summary
    if (!regex.test(domain)) {
      urlToCheck = `https://${domain}`;

      await gth.startedTask({name: `Scraping prospect's website ${urlToCheck}`})
      const webContent = await read_website_content(urlToCheck);
      await gth.completedTask()

      const messages = [
        {
          role: 'system',
          content: "You are a helpful website content summarizer. You will be passed the content of a scraped company website. Please summarize it in 250-300 words focusing on what kind of company this is, the services they offer and how they operate."
        },
        {
          role: 'user',
          content: webContent
        }];

      await gth.startedTask({name: `Summarizing website content`})
      const summaryCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.5
      });
      summary = summaryCompletion.choices[0].message.content;
      await gth.completedTask({name: "Summarized website content", result: summary})
    }
    const messages2 = [
      {
        role: 'system',
        content: `You are a helpful sales expert, great at writing enticing emails.
        You will write an email for Jack from Acme Org who wants to reach out to a prospect who just signed up for our mailing list.
        Acme Org provides an infrastructure monitoring service to help their customers avoid downtime of their cloud servers. They provide incident management and integrate with tools like PagerDuty.
        Write no more than 300 words.
        ${urlToCheck ? 'It must be tailored as much as possible to the prospect\'s company based on the website information we fetched. Don\'t mention that we got the information from the website.' : ''}`
      },
      {
        role: 'user', content: (!urlToCheck ? `Email received from ${email}` : `#Email sender:
        ${email}
        #Company website summary:
        ${summary}`)
      }];

    await gth.startedTask({name: `Drafting email response`})
    const emailDrafterCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages2,
      temperature: 0.75
    });
    const draft = emailDrafterCompletion.choices[0].message.content
    await gth.completedTask()
    await gth.serveToHuman({name: "Review email response", actionValues: [draft]})

    console.log(draft);
    return null;
  } catch (e) {
    console.error("Fct Error", e)
    throw e;
  }
}

async function read_website_content(url) {
  console.log('reading website content');

  const response = await fetch(url);
  const body = await response.text();
  let cheerioBody = await cheerio.load(body);
  const resp = {
    website_body: cheerioBody('p').text(),
    url: url,
  };
  return JSON.stringify(resp);
}

const commonProviders = [
  'gmail', 'yahoo', 'ymail', 'rocketmail',
  'outlook', 'hotmail', 'live', 'msn',
  'icloud', 'me', 'mac', 'aol',
  'zoho', 'protonmail', 'mail', 'gmx'
];

function createDomainRegex() {
  // Escape any special regex characters in the domain names
  const escapedDomains = commonProviders.map(domain => domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  // Join the domains with the alternation operator (|)
  const pattern = `(^|\\.)(${escapedDomains.join('|')})(\\.|$)`;
  return new RegExp(pattern);
}
