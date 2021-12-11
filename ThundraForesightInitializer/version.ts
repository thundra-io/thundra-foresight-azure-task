import tl = require('azure-pipelines-task-lib/task');
import toolLib = require('azure-pipelines-tool-lib/tool');

export async function getVersion(url: string, version?: string): Promise<string | undefined> {
    const axios = require('axios');

    const {data} = await axios.get(url);
    const json = await xml2json(await data);
    const availableVersions: string[] = json.metadata.versioning[0].versions[0].version
    const latestVersion: string = json.metadata.versioning[0].release[0]

    if (version && availableVersions.find(v => v === version)) {
        return version
    } else {
        return latestVersion
    }

}

async function xml2json(xml: string): Promise<any> {
    var xml2js = require('xml2js');
    var parser = new xml2js.Parser(/* options */);
    return parser.parseStringPromise(xml)

}