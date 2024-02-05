import Content from "@/content/getting-started.mdx"
import { FileLink } from "../../components/code-tree"

export default function GettingStarted() {
  return (
    <Content
      components={{
        a: CustomLink,
      }}
    />
  )
}

const CustomLink = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => {
  if (href.startsWith("!")) {
    return <FileLink path={href.slice(1)}>{children}</FileLink>
  }
  return <a href={href}>{children}</a>
}
