#!/usr/bin/env node
import {Command} from "commander";
import download from "download-git-repo";
import inquirer from "inquirer";
import handlebars from "handlebars";
import fs from "fs";
import ora from "ora";
import chalk from "chalk";
import logSymbols from "log-symbols";

const program = new Command();
const templates = {
    react: {
        downloadUrl: "ll520ww/frontend-cli",
        dec: "webpack5 + react CLI",
    },
    wx: {
        downloadUrl: "ll520ww/wx-cli",
        dec: "webpack5 + wx CLI",
    },
    h5: {
        downloadUrl: "ll520ww/frontend-h5-cli",
        dec: "webpack5 + react H5 CLI",
    }
}


program.version("2.0.4", "-v,version");


program
    .command("init <projectName> <tempName>")
    .description("项目初始化")
    .action((projectName, tempName) => {
        // 添加下载中样式
        const spinner = ora(
            `项目名称为：${projectName}, 使用模板为：${tempName} 下载中...`
        );
        spinner.start();
        if (!templates[tempName]) {
            spinner.fail(chalk.red("模板不存在"));
            return;
        }
        const {downloadUrl} = templates[tempName];
        download(
            // 下载目标，格式为：用户名/仓库名字#分支
            downloadUrl,
            // 下载完成后的项目名称，也就是文件夹名
            projectName,
            // 下载结束后的回调
            (err) => {
                // 如果错误回调不存在，就表示下载成功了
                if (err) {
                    spinner.fail(chalk.red("下载失败："));
                    console.log(err);
                    return;
                }
                spinner.succeed("下载成功！");
                inquirer
                    .prompt([
                        {
                            type: "input",
                            name: "name",
                            message: "请输入项目名称",
                        },
                        {
                            type: "input",
                            name: "description",
                            message: "请输入项目简介",
                        },
                        {
                            type: "input",
                            name: "author",
                            message: "请输入作者名称",
                        },
                    ])
                    .then((data) => {
                        const packagePath = `${projectName}/package.json`;
                        const packageContent = fs.readFileSync(packagePath, "utf-8");
                        var packageRes = handlebars.compile(packageContent)(data);
                        fs.writeFileSync(packagePath, packageRes);
                        console.log(logSymbols.success, chalk.green("初始化模板成功"));
                    });
            }
        );
    });
program
    .command("list")
    .alias("ls")
    .description("查看可用项目模块")
    .action(() => {
        for (const key in templates) {
            console.log(templates[key].dec);
        }
    });
program.parse(process.argv);
