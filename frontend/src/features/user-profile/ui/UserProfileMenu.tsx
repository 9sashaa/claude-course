'use client';

import { useRouter } from 'next/navigation';
import { LogOutIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/src/shared/ui/avatar';
import { Button } from '@/src/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/shared/ui/dropdown-menu';
import { useAuth } from '@/src/features/auth';
import { ROUTES } from '@/src/shared/config/routes';

function getInitials(name: string | null, email: string) {
  const source = (name ?? email).trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function UserProfileMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.replace(ROUTES.LOGIN);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto gap-2 px-2 py-1">
          <Avatar>
            <AvatarFallback>{getInitials(user.name, user.email)}</AvatarFallback>
          </Avatar>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-tight">
              {user.name ?? user.email}
            </p>
            {user.name && (
              <p className="text-xs text-muted-foreground leading-tight">
                {user.email}
              </p>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div>
            <p className="text-sm font-medium">{user.name ?? 'Пользователь'}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon className="size-4" /> Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
