export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border px-4 py-8 text-muted-foreground">
      <div className="page-wrap flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0">&copy; {year} JustMiles. All rights reserved.</p>
        <p className="m-0 font-medium text-primary">
          Indonesia Points & Miles Advisor
        </p>
      </div>
    </footer>
  )
}
