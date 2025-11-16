import { debug, getInput, info, setOutput, setFailed } from "@actions/core";
import { Octokit } from "@octokit/rest";

// Default to Fort Lauderdale, FL
const LATITUDE = getInput("latitude") || "26.118461";
const LONGITUDE = getInput("longitude") || "-80.158453";
const TIMEZONE = getInput("timezone") || "-5";
const GIST_ID = getInput("gist_id", { required: true });
const GIST_DESCRIPTION = getInput("gist_description");
const GITHUB_TOKEN = getInput("github_token", { required: true });
const FILENAME = getInput("filename") || "moon.txt";

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
        const date = new Date();
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        const apiUrl = `https://aa.usno.navy.mil/api/rstt/oneday?date=${dateString}&coords=${LATITUDE},${LONGITUDE}&tz=${TIMEZONE}`;

        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

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
        setOutput("date", dateString);

        // 5x60 output
        const output = [
            `CURRENT MOON (${dateString})`.padEnd(60),
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
            description: GIST_DESCRIPTION || `${phase} (${illumination})`,
            files: {
                [FILENAME]: {
                    content: moonOutput
                }
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
