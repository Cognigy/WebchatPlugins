window.onload = () => {
    let BrowserEmbeddingSample;

    UiPathRobot.init(10);

    /**
     * Get a list of processes from local robot
     */
    UiPathRobot.getProcesses().then(function (results) {
        if (results.length === 0) {
            showError("Robot not connected to Orchestrator or no processes are available")
        }
        
        buildRobotTable(results);

        // Get the ID for the sample process
        BrowserEmbeddingSample = results.find(e => e.name.includes('BrowserEmbeddingSample'))

        if (BrowserEmbeddingSample) {
            console.log("Process is available")
        } else {
            showError("BrowserEmbeddingSample not found")
        }

    }, function (err) {
        console.log("Something else went wrong", err)
        showError("Something else went wrong " + err)
    });

    const runBrowserEmbeddingSample = () => {
        let arguments = {
            ageArgIn: document.getElementById('example-input-age').value,
			nameArgIn: document.getElementById('example-input-name').value,
			surnameArgIn: document.getElementById('example-input-surname').value,			
			booleanArgIn: document.getElementById('example-input-boolean').value
        }

        document.getElementById("process-status").innerHTML = "";
        document.getElementById("process-result").innerHTML = "";

        BrowserEmbeddingSample.start(arguments).onStatus((status) => {
            console.log("Status:", status);
            if (status) {
                document.getElementById("process-status").innerHTML += `<li>${status}</li>`
            }
        }).then(
            processResults => {
                console.log(processResults)
                document.getElementById("process-result").innerHTML = `<b>Process output:</b> <br> Full Name : ${processResults.fullnameArgOut}<br> Age :  ${processResults.ageArgOut} <br> Subscription : ${processResults.booleanArgOut}`
            },
            err => {
                console.log(err)
                showError(err)
            }
        );
    }

    document.querySelector("#example-form").addEventListener("submit", function (event) {
        event.preventDefault();
        runBrowserEmbeddingSample();
    }, false);
}

function showError(err) {
    document.getElementById("error-message").innerHTML = err;
}

function refreshRobotProcesses() {
    let promise = UiPathRobot.getProcesses();
    promise.then(function (result) {
        buildRobotTable(result);

    }, function (err) {
        document.getElementById("divRobots").innerHTML = 'Error:' + err;
    });
}

function runProcess(processName) {
	let statusUdpdate = function(status) {
		let elementId = processName + '_jobStatus';
        document.getElementById(elementId).innerHTML += '<b>' + status + '</b></br>';
    };
    let promise = UiPathRobot.getProcesses();
    promise.then(function(processes) {
        let elementId = processName + '_status';
        let process = processes.find(p => p.id.includes(processName));
        document.getElementById(elementId).innerHTML = '<b>Submitted!</b>';
        process.start().onStatus(statusUdpdate).then(function(result) {
            document.getElementById(elementId).innerHTML = '<b>Completed!</b>';
        }, function(err) {
            document.getElementById(elementId).innerHTML = "<b>Job Failed!</b>" + err;
        });
    }, function(err) {
        document.getElementById("divRobots").innerHTML = 'Error:' + err;
    });
}

function buildRobotTable(robots) {
    var table = "";
    var header = "<table border=1><tr><th>Process Name</th><th>Action</th><th>Process Status</th><th>Job Status</th></tr>"
    table += header;
    var robotList = "";

    for (var i = 0; i < robots.length; i++) {
        let eleStatus = robots[i].id + '_status';
        let jobStatus = robots[i].id + '_jobStatus';
        robotList += "<tr><td>" + robots[i].name + "</td><td><button onclick=runProcess('" + robots[i].id + "');>Invoke</button></td><td><div id='" + eleStatus + "'</td><td><div id='" + jobStatus + "'</td></tr>";
    }
    table += robotList;
	table += "<tr><td># of retrieved processes with getProcesses</td><td colspan=3>"+robots.length+"</td>";
    table += "</table>"
    document.getElementById("divRobots").innerHTML = table;
}