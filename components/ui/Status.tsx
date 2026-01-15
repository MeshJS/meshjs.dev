type StatusBgColor = "red" | "green"

export const Status = (
  { title, funded, bgColor }: { title: string, funded?: boolean, bgColor: StatusBgColor }) => {

    const tailwindStyles = {
     green: "me-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300",
     red: "rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300"
    }

    const titleColor = tailwindStyles[bgColor]
    const fundedColor = funded ? tailwindStyles["green"] : tailwindStyles["red"]
    const fundedLabel = funded ? "Funded" : "Not Funded"

    return (
      <div className="flex gap-1">
        <span className={titleColor}>
          {title}
        </span>

        {
          funded !== undefined && (
            <span className={fundedColor}>
              {fundedLabel}
            </span>
          )
        }

      </div>
    )
}