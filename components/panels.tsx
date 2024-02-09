import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export function Panels({
  left,
  topRight,
  bottomRight,
}: {
  left: React.ReactNode
  topRight: React.ReactNode
  bottomRight: React.ReactNode
}) {
  return (
    <main className="flex min-h-0 flex-1 h-screen">
      <ResizablePanelGroup direction="horizontal" className="w-full">
        <ResizablePanel
          className="bg-zinc-800 prose prose-invert flex flex-col"
          minSize={25}
          defaultSize={30}
        >
          {left}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          className="flex max-h-full min-h-full flex-col"
          defaultSize={70}
        >
          <section className="w-full bg-zinc-950 flex max-h-full min-h-full flex-col">
            <ResizablePanelGroup direction="vertical" className="">
              <ResizablePanel className="" minSize={20}>
                {topRight}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel className="">
                <div className="overflow-auto h-full">{bottomRight}</div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </section>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}
