import Link from  "fumadocs-core/link";
import { TaskList } from "@/components/ui/TaskList";
import { Status } from "@/components/ui/Status";
import { Card } from 'fumadocs-ui/components/card';

export const CatalystCard = (
  { title, desc, url, completed = [], tobecompleted = [], status, funded }:
  { title: string, desc: string, url: string, completed?: string[], tobecompleted?: string[], status: string, funded?: boolean}
) => {
  const bgColor = status === "In Progress" || "Closing" ? "green" : "red"
  const h1Title = <h1>{title}</h1>

  return (<Card
    title={undefined}
  >
    <h2>{title}</h2>

    <Status title={status} funded={funded} bgColor={bgColor} />

    <p>{desc}</p>

    <TaskList
      items={[
        ...completed.map(label => ({ label, checked: true })),
        ...tobecompleted.map(label => ({ label, checked: false }))
      ]}
    />

    <Link className="text-blue-700 no-underline" href={url}>projectcatalyst.io</Link>
  </Card>)
}