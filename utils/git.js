const { Octokit } = require("octokit");
const octokit = new Octokit({
    auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
})
const axios = require('axios').default;
require("dotenv").config();

module.exports.listCommits = function listCommits(vendor = "gitlab") {
    return new Promise((resolve, reject) => {
        if (vendor === "gitlab") {
            axios.get(process.env.GITLAB_URL + "/api/v4/projects/" + process.env.GITLAB_REPO_ID + "/repository/commits", {
                headers: {
                    'PRIVATE-TOKEN': process.env.GITLAB_PERSONAL_ACCESS_TOKEN
                }
            })
                .then(res => {
                    console.log(res.data);
                    resolve(res.data);
                })
                .catch(err => reject(err));
        } else {
            octokit.request('GET /repos/{owner}/{repo}/commits', {
                owner: process.env.GITHUB_OWNER,
                repo: process.env.GITHUB_REPO
            })
                .then(({ data }) => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        }
    });
}

module.exports.getCommit = function getCommit(vendor = "gitlab", sha) {
    return new Promise((resolve, reject) => {
        if (vendor === "gitlab") {
            axios.get(process.env.GITLAB_URL + "/api/v4/projects/" + process.env.GITLAB_REPO_ID + "/repository/commits/" + sha, {
                headers: {
                    'PRIVATE-TOKEN': process.env.GITLAB_PERSONAL_ACCESS_TOKEN
                }
            })
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => reject(err));
        } else {
            octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
                owner: process.env.GITHUB_OWNER,
                repo: process.env.GITHUB_REPO,
                ref: sha
            })
                .then(({ data }) => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        }
    });
}