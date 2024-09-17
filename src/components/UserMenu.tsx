import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthActions } from "@convex-dev/auth/react";
import { PersonIcon } from "@radix-ui/react-icons";
import { useQuery } from "convex/react";
import { ReactNode } from "react";
import { api } from "../../convex/_generated/api";

interface MenuProps {
  children: ReactNode;
  changeView?: any;
}

export function UserMenu({children, changeView }: MenuProps) {
  const user = useQuery(api.users.viewer);

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
            <img src={"/chat.png"} alt="" className="chat max-w-5 block mx-4 cursor-pointer"
            onClick={() => changeView((prev:boolean) => !prev)} />
      {children}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            
            {
              user ? <img src={user?.image} alt="" className="w-full h-full rounded-full" /> : <PersonIcon className="h-5 w-5" />
            }
       
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{children}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="flex items-center gap-2 py-0 font-normal">
            Theme
            <ThemeToggle />
          </DropdownMenuLabel>
          <SignOutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function SignOutButton() {
  const { signOut } = useAuthActions();
  return (
    <DropdownMenuItem onClick={() => void signOut()}>Sign out</DropdownMenuItem>
  );
}
