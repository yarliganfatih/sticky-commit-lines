const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const process = require('process');

const ignoreList = [".git", ".idea", "node_modules"];

function getDirectoryTree(dirPath) {
    const stats = fs.statSync(dirPath);

    if (stats.isFile()) {
        return {
            type: "file",
            name: path.basename(dirPath)
        };
    }

    const children = fs.readdirSync(dirPath)
        .filter(child => !ignoreList.includes(child))
        .map(child =>
            getDirectoryTree(path.join(dirPath, child))
        );

    return {
        type: "directory",
        name: path.basename(dirPath),
        children: children
    };
}

function parseGitDiff(diffOutput) {
    const lines = diffOutput.split("\n");
    const changes = [];
    let currentFile = null;
    let currentLine = null;

    lines.forEach(line => {
        if (line.startsWith("diff --git")) {
            currentFile = null; 
        } else if (line.startsWith("--- ") || line.startsWith("+++ ")) {
            const fileMatch = line.match(/\+\+\+ (.+)/);
            if (fileMatch) {
                currentFile = { file: path.basename(process.cwd())+"/"+fileMatch[1].trim(), changes: [] };
                changes.push(currentFile);
            }
        } else if (line.startsWith("@@")) {
            const match = line.match(/@@ -\d+(,\d+)? \+(\d+)(,\d+)? @@/);
            if (match && currentFile) {
                currentLine = parseInt(match[2]); 
            }
        } else if (line.startsWith("-") && !line.startsWith("---") && currentFile && line.substring(1).trim()!="") {
            currentFile.changes.push({
                type: "-",
                line: currentLine,
                content: line.substring(1)
            });
        } else if (line.startsWith("+") && !line.startsWith("+++") && currentFile && line.substring(1).trim()!="") {
            currentFile.changes.push({
                type: "+",
                line: currentLine,
                content: line.substring(1)
            });
            currentLine++;
        } else if (line.trim() !== "") {
            currentLine++;
        }
    });

    return changes;
}

function getCommitChanges() {
    const logOutput = execSync(
        'git log --pretty=format:"{\\"hash\\":\\"%H\\",\\"author\\":\\"%an\\",\\"date\\":\\"%ad\\",\\"message\\":\\"%s\\"}," --date=iso',
        { encoding: "utf-8" }
    );
    const jsonStr = `[${logOutput.slice(0, -1).replaceAll("\n", "")}]`;
    const commits = JSON.parse(jsonStr);
    commits.forEach(commit => {
        const diffOutput = execSync(`git show --unified=0 --format= --no-prefix ${commit.hash}`, { encoding: "utf-8" });
        commit.changes = parseGitDiff(diffOutput);
    });
    return commits;
}

const result = {
    files: [getDirectoryTree(process.cwd())],
    commits: getCommitChanges().reverse()
}
console.log(JSON.stringify(result, null, 2));
