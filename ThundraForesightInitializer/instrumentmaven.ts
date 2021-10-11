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
    tl.debug('> Downloading the maven instrumentater')
    const mvnInstrumentaterPath = await toolLib.downloadTool(
        `https://repo1.maven.org/maven2/io/thundra/plugin/thundra-agent-maven-test-instrumentation/${mavenInstrumenterVersion}/thundra-agent-maven-test-instrumentation-${mavenInstrumenterVersion}.jar`, 'thundra-agent-maven-test-instrumentation.jar'
    )


    tl.debug(`> Successfully downloaded the maven instrumentater to ${mvnInstrumentaterPath}`)

    tl.debug('> Updating pom.xml...')

    const poms = await execPromise(`sh -c "find ${process.cwd()} -name \\"pom.xml\\" -exec echo '{}' +"`)
    if (poms && poms.trim()) {
        await execPromise(`sh -c "java -jar ${mvnInstrumentaterPath} ${agentPath} \\"${poms.trim()}\\""`)
        tl.debug('> Update to pom.xml is done')
    } else {
        tl.warning("> Couldn't find any pom.xml files. Exiting the instrumentation step.")
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