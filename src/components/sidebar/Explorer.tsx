import React, { useState } from 'react';
import { RiArrowDownSLine, RiArrowRightSLine } from 'react-icons/ri';
import FILE_ICONS from '../../utils/FileIcons';

import gitData from "../../assets/data.json";

interface CssVar extends React.CSSProperties {
    [key: `--${string}`]: Number;
}

interface Children {
    children: React.ReactNode;
}

interface FolderProps {
    children: React.ReactNode;
    name: string;
    wasOpen: boolean;
    padding: Number;
    bold: boolean;
}

interface FileProps {
    name: string;
    path: string;
    padding: Number;
    handleFileSelect: any;
    selected: boolean;
}

function Tree({ children }: Children) {
    return (
        <div className="leading-6 w-56">
            {children}
        </div>
    )
}

function File({ name, path, padding, handleFileSelect, selected }: FileProps) {

    let ext = name.split('.')[1]

    const handleClick = () => {
        handleFileSelect(path+name);
    }

    if (selected) {
        return (
            <div className={"flex items-center cursor-pointer bg-zinc-600 pb-1 subDir"} style={{"--sub-dir": padding} as CssVar} onClick={handleClick}>
                {FILE_ICONS[ext] || <RiArrowRightSLine />}
                <span className="ml-1 font-['Consolas', 'Courier New', 'monospace'] text-sm">{name}</span>
            </div>
        )
    }

    return (
        <div className={"flex items-center cursor-pointer hover:bg-zinc-700 pb-1 subDir"} style={{"--sub-dir": padding} as CssVar} onClick={handleClick}>
            {FILE_ICONS[ext] || <RiArrowRightSLine />}
            <span className="ml-1 font-['Consolas', 'Courier New', 'monospace'] text-sm">{name}</span>
        </div>
    )
}

function Folder({ children, name, wasOpen, padding, bold }: FolderProps) {
    const [isOpen, setIsOpen] = useState(wasOpen);

    const handleToggle = (e: any) => {
        e.preventDefault();
        setIsOpen(!isOpen);

    }

    let nameElement = <h1>{name}</h1>
    if (bold) {
        nameElement = <h1><b>{name}</b></h1>
    }
    
    return (
        <div className="">
            <div className={"flex items-center cursor-pointer hover:bg-zinc-700 pb-1 subDir"} style={{"--sub-dir": padding} as CssVar} onClick={handleToggle}>
                {isOpen ? <RiArrowDownSLine /> : <RiArrowRightSLine />}
                <span className="ml-1 font-['Consolas', 'Courier New', 'monospace'] text-sm">{nameElement}</span>
            </div>
            <div className={isOpen ? "h-auto overflow-hidden" : 'h-0 overflow-hidden'}>{children}</div>
        </div>
    )
}

Tree.File = File;
Tree.Folder = Folder;

interface ExplorerProps {
    selectedFile: string
    handleFileSelect: any
}

function Explorer({ selectedFile, handleFileSelect }: ExplorerProps) {
    const getFilesTree = (item:any, deep=1, path="") => {
        if (item.type=="directory") {
            return (
                <Tree.Folder key={path+item.name} name={item.name} wasOpen={selectedFile.startsWith(path+item.name)} bold={deep==1} padding={deep}>
                    { item.children.map((subItem:any) => getFilesTree(subItem, deep+1, path+item.name+"/")) }
                </Tree.Folder>
            )
        } else if (item.type=="file") {
            return <Tree.File key={path+item.name} name={item.name} path={path} selected={selectedFile === path+item.name} padding={deep+1} handleFileSelect={handleFileSelect} />
        }
    }

    return (
        <div className="flex flex-col w-fit h-screen text-white bg-zinc-800">
            <div className="flex flex-row h-8 justify-start items-center">
                <h1 className="text-sm pl-5">EXPLORER</h1>
            </div>
            <Tree>
                { gitData.files.map((file) => getFilesTree(file, 1, "")) }
            </Tree>
        </div>
    );
}

export default Explorer;
