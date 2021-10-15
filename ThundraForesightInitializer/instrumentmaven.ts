import tl = require('azure-pipelines-task-lib/task');
import toolLib = require('azure-pipelines-tool-lib/tool');
import {getVersion} from "./version";
const MAVEN_INSTRUMENTATION_METADATA =
    'https://repo1.maven.org/maven2/io/thundra/plugin/thundra-agent-maven-test-instrumentation/maven-metadata.xml'
var exec = require('child_process').exec;

export async function instrumentmaven(instrumenter_version?: string, agentPath?: string): Promise<void> {
    const mavenInstrumenterVersion: string | undefined = await getVersion(
        MAVEN_INSTRUMENTATION_METADATA,
        instrumenter_version
    )
    if (!mavenInstrumenterVersion) {
        tl.setResult(tl.TaskResult.Failed, '> Couldn\'t find an available version for Thundra Maven Instrumentation script');

        return
    }
    console.log('> Downloading the maven instrumentater')
    const mvnInstrumentaterPath = await toolLib.downloadTool(
        `https://repo1.maven.org/maven2/io/thundra/plugin/thundra-agent-maven-test-instrumentation/${mavenInstrumenterVersion}/thundra-agent-maven-test-instrumentation-${mavenInstrumenterVersion}.jar`, 'thundra-agent-maven-test-instrumentation.jar'
    )


    console.log(`> Successfully downloaded the maven instrumentater to ${mvnInstrumentaterPath}`)

    console.log('> Updating pom.xml...')
    const fs = require('fs');

    let poms = '';
    fs.readdirSync(__dirname).forEach(file => {
        poms += file;
    });

    console.log('>found pom files: ' + poms.toString())

    if (poms && poms.trim()) {
        await execPromise(`"java -jar ${mvnInstrumentaterPath} ${agentPath} \\"${poms.trim()}\\""`)
        console.log('> Update to pom.xml is done')
    } else {
        console.warn("> Couldn't find any pom.xml files. Exiting the instrumentation step.")
    }
}

async function execPromise(command):Promise<string> {

    return new Promise(function(resolve, reject) {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
        });
    });
}