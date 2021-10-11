import tl = require('azure-pipelines-task-lib/task');
import * as ejs from 'ejs'
import { writeFileSync } from 'graceful-fs'
import { resolve, join } from 'path'
import {getVersion} from "./version";
const GRADLE_TEST_PLUGIN =
    'https://repo1.maven.org/maven2/io/thundra/plugin/thundra-gradle-test-plugin/maven-metadata.xml'

export async function instrumentgradle(instrumenter_version?: string, agentPath?: string): Promise<void> {
    const gradlePluginVersion: string | undefined = await getVersion(GRADLE_TEST_PLUGIN, instrumenter_version)
    if (!gradlePluginVersion) {
        console.warn("> Couldn't find an available version for Thundra Gradle Test Plugin")
        console.warn('> Instrumentation failed!')
        return
    }
    console.log('> Generating init file...')
    const templatePath = join(__dirname, 'templates/thundra.gradle.ejs')
    let gradle_home_dir:string = process.env.GRADLE_HOME!;
    const initFilePath = join(gradle_home_dir, 'init.d/thundra.gradle')
    const ejsData = {
        thundra: {
            gradlePluginVersion,
            agentPath
        }
    }
    ejs.renderFile(templatePath, ejsData, (error, result) => {
        if (error) {
            console.warn(`> EJS couldn't render the template file at ${templatePath} with ${JSON.stringify(ejsData)}`)
            console.warn(`> Caught the error: ${error}`)
            console.warn('> Instrumentation failed!')
            return
        }

        try {
            tl.setVariable('THUNDRA_GRADLE_INIT_SCRIPT_PATH', initFilePath)
            console.log(`> Successfully generated init file at ${initFilePath}`)

            writeFileSync(initFilePath, result, 'utf-8')
        } catch (err) {
            console.warn(`> Couldn't write rendered EJS template to a file`)
            console.warn(`> Caught the error: ${err}`)
            console.warn('> Instrumentation failed!')
            return
        }
    })

    resolve('Instrumentation is completed.')
}
