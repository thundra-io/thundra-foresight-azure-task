# Thundra Foresight Initializer Task

![Ubuntu badge](https://badgen.net/badge/icon/Ubuntu?icon=terminal&label)
![macOS badge](https://badgen.net/badge/icon/macOS?icon=apple&label)
![Windows badge](https://badgen.net/badge/icon/Windows?icon=windows&label)

**Thundra Foresight is a tool for debugging and troubleshooting test failures in no time and optimize build duration and performance in your CI pipeline.**

You can empower your Azure Devops pipeline with Distributed Tracing and  Time-Travel Debugging.

Thundra Foresight Initializer Task automatically changes your build configurations to integrate with Thundra Foresight.

You can integrate your Azure Devops Project pipeline in just 2 steps. First, you need to install the task to your azure devops organization from Visual Studio Marketplace. Then, configure your Azure Devops Project Pipeline yaml. After completing those steps, Foresight will capture your test runs automatically.


**Prerequisites for Task**

1. [**Thundra Account**](https://start.thundra.io/) to record and manage all the process
2. [**Foresight project**](https://foresight.docs.thundra.io/core-concepts/creating-a-project/core-concepts/creating-a-project) to gather parameters
3. `Thundra Foresight Apikey` to connect your pipeline with the Thundra Java agent. It can be obtained from the [**project settings page**](https://foresight.docs.thundra.io/core-concepts/managing-your-project-settings).
4. `Thundra Foresight Project Id` to connect your test runs with the Foresight project. It can be obtained from the [**project settings page**.](https://foresight.docs.thundra.io/core-concepts/managing-your-project-settings)

**Adding task to your pipeline**

- First of all install Thundra Foresight Initializer extension to your azure devops organization.
- Select project that you want to integrate Foresight and Edit your pipeline yaml file or editor.
  
  **Add with Classic Editor**
- If you use  the classic editor to create a pipeline without YAML, Search Thundra Foresight Initializer task from task list (shown below), Add this task to pipeline, **after checkout step and before maven or gradle build/test/verify step**
  ![GUI Editor](images/screenshot_taskgui.png)
  
  **Add with yaml**
- If you want to use pipeline with yaml, Add this code snippet to your yaml, **between checkout and  maven or gradle test step**
  ![yaml](images/screenshot_taskyaml.png)

      - task: ThundraForesightInitializer@0
        inputs:
          api_key: '$(THUNDRA_APIKEY)'
          project_id: '$(THUNDRA_AGENT_TEST_PROJECT_ID)'
          build_run_type: **Select from list**

**Additional configuration for Gradle** 

- After adding task described below, You should add an init script parameter '--init-script=$(THUNDRA_GRADLE_INIT_SCRIPT_PATH)'

   **Add with yaml**

        - task: Gradle@2
          inputs:
          workingDirectory: ''
          gradleWrapperFile: 'gradlew'
          options: '--init-script=$(THUNDRA_GRADLE_INIT_SCRIPT_PATH)'
          gradleOptions: '-Xmx3072m'
          javaHomeOption: 'JDKVersion'
          jdkVersionOption: '1.8'
          jdkArchitectureOption: 'x64'
          publishJUnitResults: true
          testResultsFiles: '**/TEST-*.xml'
          tasks: 'build'

   **Add with classic editor**
- Add **--init-script=$(THUNDRA_GRADLE_INIT_SCRIPT_PATH)** value to Gradle task option.
  ![Gradle](images/screenshot_gradle.png)

**Variables**

Go to your Pipeline **Variables** page and add the `THUNDRA_APIKEY` (don't forget to keep this value as secret) and `THUNDRA_AGENT_TEST_PROJECT_ID` variables wtih your foresight project configuration described before.

## Parameters

| Name                  | Requirement       | Description
| ---                   | ---               | ---
| apikey                | Required          | Thundra API Key
| project_id            | Required          | Your project id from Thundra. Will be used to filter and classify your testruns.
| instrumenter_version  | Optional          | In the action itself, we use a Java script to manipulate pom.xml files. This script is released and versioned separately from the action. Hence, if there is some breaking change or specific version you want to use, you can use it by defining this parameter. You can see all the available version of our instrumenter [here](https://search.maven.org/artifact/io.thundra.plugin/thundra-agent-maven-test-instrumentation).
| agent_version         | Optional          | A specific version Thundra Java Agent you want to use should be defined here. Similar to `instrumenter_version` parameter. You can see all the available version of our agent [here](https://repo.thundra.io/service/local/repositories/thundra-releases/content/io/thundra/agent/thundra-agent-bootstrap/maven-metadata.xml).
| parent_pom_path       | Optional          | Use if your parent pom is in somewhere other that ./pom.xml. **Must be a relative path in your build source directory.**

   For further information please visit: [https://foresight.docs.thundra.io/integrations/azure-devops](https://foresight.docs.thundra.io/integrations/azure-devops)