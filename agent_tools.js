import { Agent, run, tool } from "@openai/agents";
import {z} from "zod";
import axios from "axios";
import 'dotenv/config'

const getWeatherTool = tool({
    name:"get_weather",
    description:"returns the current weather information for the given city",
    parameters: z.object({
        city: z.string().describe('name of the city'),
    }),
    execute: async function({city}) {
        const url = `https://wttr.in/${city.toLowerCase()}?format=%C+%t`;
        const response = axios.get(url, {responseType: 'text'});
        return `The weather of ${city} is ${(await response).data}`;
           
    },
})


const agent = new Agent({
    name:'Weather Agent',
    instructions:`
    You are an expert weather agent that helps user to tell weather repot
    `,

    tool: [getWeatherTool],
});

async function main(quey ="") {
    const result = await run(agent, quey);
    console.log(`Result:`, result.finalOutput);
}

main(`What is the weather of Ghaziabad?`);