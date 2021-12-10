import tl = require('azure-pipelines-task-lib/task');
import {instrument} from "./instrument";
import {VariableInfo} from "azure-pipelines-task-lib";

const instrumenter_version: string | undefined = tl.getInput('instrumenter_version', false);
const agent_version: string | undefined = tl.getInput('agent_version', false);
const apiKey: string | undefined = tl.getInput('api_key', true)
const projectId: string | undefined = tl.getInput('project_id', true)
const parent_pom_path: string | undefined = tl.getInput('parent_pom_path', false)
const build_run_type: string | undefined = tl.getInput('build_run_type', false)

function getVariable(name: string) {
    var variables: VariableInfo[] = tl.getVariables();
    let variable = variables.find(x => x.name == name);
    return variable;
}

if (apiKey) {
    let variable = getVariable('THUNDRA_APIKEY');
    tl.setVariable('THUNDRA_APIKEY', apiKey, variable == undefined ? false : variable.secret)
    console.log(variable);
}
if (projectId) {
    let variable = getVariable('THUNDRA_AGENT_TEST_PROJECT_ID');
    tl.setVariable('THUNDRA_AGENT_TEST_PROJECT_ID', projectId, variable == undefined ? false : variable.secret)
    console.log(variable);
}
if (parent_pom_path) {
    tl.setVariable('THUNDRA_MAVEN_INSTRUMENTATION_PARENT_POM', parent_pom_path)
}

async function run() {
    try {
        console.log(`[Thundra] Initializing the Thundra Action...`)
        await instrument(instrumenter_version, agent_version, build_run_type)
    } catch (err) {
        let errorMessage = "Failed to do something exceptional";
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        console.log(errorMessage);
        tl.setResult(tl.TaskResult.Failed, errorMessage);

    }

}


run();
