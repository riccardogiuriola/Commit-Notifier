const fs = require('fs');
const { addedDiff } = require("deep-object-diff");
const { listCommits, getCommit } = require('./utils/git');
const { sendMessage } = require("./utils/telegram");
require("dotenv").config();

const fileName = process.env.FILE_NAME;

function readCommits() {
    if (!fs.existsSync(fileName)) {
        return false;
    }
    let data = fs.readFileSync(fileName);
    return JSON.parse(data);
}

function writeCommits(data, file = fileName) {
    let commits = JSON.stringify(data, null, 2);
    fs.writeFileSync(file, commits);
}

async function checkUpdatedCommits(data) {
    return new Promise((resolve, reject) => {
        let commits = readCommits();
        if (commits) {
            let diff = addedDiff(commits, data);
            if (Object.keys(diff).length > 0) {
                writeCommits(data);
                getCommit(process.env.VENDOR, process.env.VENDOR === "gitlab" ? data[0].id : data[0].sha).then(commit => {
                    resolve(commit);
                });
            } else {
                resolve(false);
            }
        } else {
            writeCommits(data);
            resolve(false);
        }
    })
}

function main() {
    listCommits(process.env.VENDOR).then(async data => {
        checkUpdatedCommits(data)
            .then((d) => {
                let check = d;
                if (check) {
                    let payload = "";
                    if (process.env.VENDOR === "gitlab") {
                        payload = `${check.web_url}\n<b>Messaggio:</b> ${check.message}<b>Autore:</b> ${check.author_name}\n<b>Data:</b> ${check.created_at}\n<b>Stats: </b>Totali: ${check.stats.total} - Inserite: ${check.stats.additions} - Eliminate: ${check.stats.deletions}`;
                    } else {
                        let commit = check.commit;
                        payload = `${check.html_url}\n<b>Messaggio:</b> ${commit.message}\n<b>Autore:</b> ${commit.author.name}\n<b>Data:</b> ${commit.author.date}\n<b>Stats: </b>Totali: ${check.stats.total} - Inserite: ${check.stats.additions} - Eliminate: ${check.stats.deletions}`;
                    }
                    sendMessage(payload);
                }
            })
    })
        .catch(err => {
            console.log(err);
        });
}

main();
/* setInterval(() => {
    main();
}, 600000) */