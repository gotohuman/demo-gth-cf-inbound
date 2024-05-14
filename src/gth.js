import {v4 as uuidv4} from 'uuid';

class GoToHuman {
    constructor(apiKey, agentId, agentRunId = uuidv4()) {
        this.apiKey = apiKey;
        this.agentId = agentId;
        this.agentRunId = agentRunId;
    }

    async callGoToHuman(state, params, stepResult = null, suggestionToApprove = null) {
        const url = "https://api.gotohuman.com/postRunState";
        const data = {
            apiKey: this.apiKey,
            agentId: this.agentId,
            agentRunId: this.agentRunId,
            state: state,
            ...params,
            ...(stepResult !== null ? { result: stepResult } : {}),
            ...(suggestionToApprove !== null ? { actionValues: [suggestionToApprove], allowEditing: true } : {})
        };

        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
          })
          const responseJson = await response.json();
          if (response.status === 200 || response.status === 201) {
              console.log("Request successful! Response:", responseJson);
              return responseJson;
          } else {
              console.error(`Failed to make request. Status Code: ${response.status} Response: ${responseJson}`);
              throw new Error(`Failed to send to gotoHuman: ${responseJson}`);
          }
        } catch (error) {
            console.error(`Error: ${error.message}`);
            throw error;
        }
    }

    async startedTask({name, desc = null} = {}) {
        console.log(`startedTask ${name}`);
        this.lastTaskName = name;
        return await this.callGoToHuman("task_running", {
            taskName: name,
            ...(desc !== null ? { taskDesc: desc } : {})
        });
    }

    async completedTask({name = null, desc = null, result = null} = {}) {
        const nameToSend = name || this.lastTaskName;
        console.log(`completedTask ${nameToSend} ${result}`);
        return await this.callGoToHuman("task_done", {
            taskName: nameToSend,
            ...(desc !== null ? { taskDesc: desc } : {}),
            ...(result !== null ? { result: result } : {})
        });
    }

    async requestHumanApproval({taskName = null, taskDesc = null, actionValues = null, allowEditing = false, completedTasks = null} = {}) {
        console.log(`requestHumanApproval ${taskName} ${taskDesc} ${actionValues} ${allowEditing} ${completedTasks}`);
        return await this.callGoToHuman("requested_human_approval", {
            ...(taskName !== null ? { taskName: taskName } : {}),
            ...(taskDesc !== null ? { taskDesc: taskDesc } : {}),
            ...(actionValues !== null ? { actionValues: actionValues } : {}),
            allowEditing: allowEditing,
            ...(completedTasks !== null ? { completedTasks: completedTasks } : {})
        });
    }

    async serveToHuman({taskName = null, taskDesc = null, actionValues = null, completedTasks = null} = {}) {
        console.log(`serveToHuman ${taskName} ${taskDesc} ${actionValues} ${completedTasks}`);
        return await this.callGoToHuman("served_to_human", {
            ...(taskName !== null ? { taskName: taskName } : {}),
            ...(taskDesc !== null ? { taskDesc: taskDesc } : {}),
            ...(actionValues !== null ? { actionValues: actionValues } : {}),
            ...(completedTasks !== null ? { completedTasks: completedTasks } : {})
        });
    }
}

module.exports = GoToHuman;