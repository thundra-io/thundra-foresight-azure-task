import tl = require('azure-pipelines-task-lib/task');
import toolLib = require('azure-pipelines-tool-lib/tool');

import { getVersion } from './version'
import { instrumentmaven } from './instrumentmaven'
import { instrumentgradle } from './instrumentgradle'
import { resolve } from 'path'

const THUNDRA_AGENT_METADATA =
    'https://repo.thundra.io/service/local/repositories/thundra-releases/content/io/thundra/agent/thundra-agent-bootstrap/maven-metadata.xml'

export async function instrument(instrumenter_version?: string, agent_version?: string, build_run_type?: string): Promise<void> {
    let agentPath: string

    const thundraAgentVersion: string | undefined = await getVersion(THUNDRA_AGENT_METADATA, agent_version)
    if (!thundraAgentVersion) {
        tl.setResult(tl.TaskResult.Failed, '> Couldn\'t find an available version for Thundra Agent');
        return
    }

    tl.debug('thundraAgentVersion: ' +thundraAgentVersion);
    if (process.env.LOCAL_AGENT_PATH) {
        agentPath = process.env.LOCAL_AGENT_PATH
        tl.debug('> Using the local agent at ${agentPath}');

    } else {
        console.log('> Downloading the agent...')
        agentPath = await toolLib.downloadTool(
            `https://repo.thundra.io/service/local/repositories/thundra-releases/content/io/thundra/agent/thundra-agent-bootstrap/${thundraAgentVersion}/thundra-agent-bootstrap-${thundraAgentVersion}.jar`, 'thundra-agent-bootstrap.jar'
        )
        tl.debug(`> Successfully downloaded the agent to ${agentPath}`)
    }
    if (build_run_type == undefined || build_run_type === 'Maven') {
        console.log('> Starting maven instrumentation...')
        await instrumentmaven(instrumenter_version, agentPath)
    }
    else if(build_run_type === 'Gradle'){
        console.log('> Starting gradle instrumentation...')
        await instrumentgradle(instrumenter_version, agentPath)
    }

    resolve('Thundra Foresight Instrumentation is completed');
}