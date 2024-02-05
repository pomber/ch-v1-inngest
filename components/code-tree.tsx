"use client"

import React from "react"
import { cn } from "../lib/utils"
import { FileTree } from "./ui/file-tree"
import { useCurrentStep } from "./steps"

export type TreeNode = FileNode | FolderNode
export interface FileNode {
  id: string
  name: string
  content: React.ReactNode
}
export interface FolderNode {
  id: string
  name: string
  children: TreeNode[]
}

const FileTreeContext = React.createContext({
  select: (id: string) => {},
  selected: "",
})

export function FileTreeProvider({ children }: { children: React.ReactNode }) {
  const [selected, select] = React.useState("")

  return (
    <FileTreeContext.Provider value={{ select, selected }}>
      {children}
    </FileTreeContext.Provider>
  )
}

export function FileLink({
  path,
  children,
}: {
  path: string
  children?: React.ReactNode
}) {
  const { select } = React.useContext(FileTreeContext)
  return (
    <button
      onClick={() => select(path)}
      className="text-blue-300 hover:text-blue-400"
    >
      {children}
    </button>
  )
}

export function CodeTree({ className }: { className?: string }) {
  const tree = useCurrentStep().files as TreeNode[]
  const { select, selected } = React.useContext(FileTreeContext)

  const files: FileNode[] = []
  const folders: FolderNode[] = [{ children: tree, id: "", name: "" }]
  while (folders.length > 0) {
    const folder = folders.pop()!
    folder.children.forEach((child) => {
      if ("content" in child) {
        files.push(child)
      } else {
        folders.push(child)
      }
    })
  }
  const selectedFile = files.find((file) => file.id === selected)

  return (
    <div className={cn("flex", className)}>
      <div className="h-full border-r border-neutral-700 text-white pt-4 w-48 min-w-48">
        <FileTree tree={tree} select={select} selected={selected} />
      </div>
      <div className="p-4" key={selected}>
        {selectedFile?.content}
      </div>
    </div>
  )
}
