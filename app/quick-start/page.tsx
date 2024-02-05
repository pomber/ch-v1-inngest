import Content from "@/content/getting-started.mdx"
import { FileLink } from "../../components/code-tree"

export default function GettingStarted() {
  return (
    <Content
      components={{
        // @ts-ignore
        a: CustomLink,
      }}
    />
  )
}

const CustomLink = ({
  href,
  children,
  ...rest
}: {
  href: string
  children: React.ReactNode
}) => {
  if (href.startsWith("!")) {
    return <FileLink path={href.slice(1)}>{children}</FileLink>
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}
