import { debug, getInput, info, setOutput, setFailed } from "@actions/core";
import { Octokit } from "@octokit/rest";

// Default to Fort Lauderdale, FL
const LATITUDE = getInput("latitude") || "26.118461";
const LONGITUDE = getInput("longitude") || "-80.158453";
const TIMEZONE = getInput("timezone") || "-5";
const GIST_ID = getInput("gist_id", { required: true });
const GITHUB_TOKEN = getInput("github_token", { required: true });
const FILENAME = getInput("filename") || "moon.txt";

function getApiDate() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function fetchMoonData(date) {
    const apiUrl = `https://aa.usno.navy.mil/api/rstt/oneday?date=${date}&coords=${LATITUDE},${LONGITUDE}&tz=${TIMEZONE}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
        throw new Error(data.error);
    }
    
    return data;
}

function renderMoonGraphic(phaseName) {
    const moon = {
        "New Moon": [
            "     /-------\\",
            "    (         )",
            "     \\-------/"
        ],
        "Waxing Crescent": [
            "     /##-----\\",
            "    (###      )",
            "     \\##-----/"
        ],
        "First Quarter": [
            "     /#####--\\",
            "    (######   )",
            "     \\#####--/"
        ],
        "Waxing Gibbous": [
            "     /#######-\\",
            "    (######## )",
            "     \\#######-/"
        ],
        "Full Moon": [
            "     /#########\\",
            "    (###########)",
            "     \\#########/"
        ],
        "Waning Gibbous": [
            "     /-#######\\",
            "    ( ########)",
            "     \\-#######/"
        ],
        "Third Quarter": [
            "     /--#####\\",
            "    (   ######)",
            "     \\--#####/"
        ],
        "Waning Crescent": [
            "     /-----##\\",
            "    (      ###)",
            "     \\-----##/"
        ]
    };

    for (const key in moon) {
        if (phaseName.includes(key)) {
            return moon[key];
        }
    }
    
    return moon["New Moon"];
}

async function run() {
    try {
        info(`Fetching moon data for coordinates: ${LATITUDE}, ${LONGITUDE} (TZ: ${TIMEZONE})`);
        
        const date = getApiDate();
        const data = await fetchMoonData(date);

        const moonData = data.properties?.data;
        if (!moonData) {
            throw new Error("Unexpected API response structure");
        }

        const phase = moonData.curphase || "Unknown";
        const illumination = moonData.fracillum || "N/A";
        const graphic = renderMoonGraphic(phase);

        // Set outputs for GitHub Actions
        setOutput("phase", phase);
        setOutput("illumination", illumination);
        setOutput("date", date);

        // 5x60 output
        const output = [
            `CURRENT MOON (${date})`.padEnd(60),
            graphic[0].padEnd(60),
            graphic[1].padEnd(60),
            graphic[2].padEnd(60),
            `Phase: ${phase} | Illumination: ${illumination}`.padEnd(60)
        ];
        
        const moonOutput = output.join('\n');
        console.log(moonOutput);
        
        // Update gist with moon phase
        info(`Updating gist ${GIST_ID}...`);
        const octokit = new Octokit({ auth: GITHUB_TOKEN });
        
        await octokit.request('PATCH /gists/{gist_id}', {
            gist_id: GIST_ID,
            description: `Current Moon Phase - ${phase} (${illumination})`,
            files: {
                [FILENAME]: {
                    content: moonOutput
                }
            },
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        
        info(`✓ Gist updated successfully!`);
        info(`Moon phase: ${phase} (${illumination} illuminated)`);
    } catch (error) {
        setFailed(`Failed to update gist: ${error.message}`);
    }
}

// Execute
run();
