import axios from 'axios';
import { load } from 'cheerio';
import { ru } from 'chrono-node';
import { writeFile } from 'fs/promises';

// Fastest solution w/o anti-froud system.
// 
// How-to:
// 1. Open organization (topic) page (ex. https://ria.ru/organization_Sberbank_Rossii/)
// 2. Open Developer tools, then Networking tab.
// 3. Search for «more.html», open Response tab.
// 4. Copy «data-next-url» prop's data, and paste it there:
// 
// P.S. You can find first post's id & date, but this method (^^^) is more efficient, idc.

var nextUrl = "/services/organization_Sberbank_Rossii/more.html?id=<...>&date=<...>";

async function sleep(ms: number) {
    return await new Promise((res, _) => setTimeout(res, ms));
}

type Item = {
    title: string,
    date: Date,
    views: number,
    link: string,
    project?: string
}

var ITEMS: Array<Item> = [];

async function process(offset: number = 0, i: number = 5) {
    try {
        const { data } = await axios.get(`https://ria.ru${nextUrl}`);
        const $ = load(data);

        if (!data) throw new Error('No data.');

        const _nextUrl = $('.list-items-loaded').attr('data-next-url');

        // Known issue: didn't parsing if no next url but there are some results.
        if (!_nextUrl || $('.list-item-notfound').length > 0) {
            console.log(`Total - ${ITEMS.length}.`);
            return await writeFile('data.json', JSON.stringify(ITEMS, undefined, 2));
        }

        nextUrl = _nextUrl;

        const items = $('.list-item').map(function (_, el): Item {
            const link = $('.list-item__image', el).attr('href') ?? "";
            
            return {
                title: $('.list-item__title', el).html() ?? "",
                date: ru.parseDate($('.list-item__date', el).html() ?? ""),
                link,
                views: parseInt($('.list-item__views-text', el).html() ?? "0"),
                project: link?.replace('https://', '')?.split('/')[0]?.replace('ria.ru', '')?.replace('.', '')
            }
        }).get();

        console.log(`Current - ${offset + 20}.`);
        console.log(items.reverse()[0])

        const doubles = ITEMS.filter((e) => items.includes(e));
        ITEMS.push(...items);
        if (doubles[0]) {
            console.log(`${doubles.length} doubles removed.`)
            offset += doubles.length;
            ITEMS = ITEMS.filter((e) => !items.includes(e));
        }
        if (i > 5) i -= 5;
    } catch (error) {
        console.log(`Waiting ${i} sec. ${error}`);
        await sleep(i * 1000);
        i += 5;
    }

    // await sleep(3000);
    await process(offset+20, i)
}

process();