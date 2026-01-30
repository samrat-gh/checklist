import Login from "@/components/login";
import { ModeToggle } from "@/components/theme-menu";

export default function Home() {
  return (
    <div className="p-4">
      <header className="flex items-center justify-between">
        <h1 className="font-semibold text-xl">Expense Tracker</h1>
        <div className="flex items-center gap-3">
          <ModeToggle />
          <Login />
        </div>
      </header>
    </div>
  );
}
