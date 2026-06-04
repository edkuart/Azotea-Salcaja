"use client";

import { Trash2 } from "lucide-react";

type Props = {
  action: () => Promise<void>;
  confirm: string;
  className?: string;
  iconOnly?: boolean;
  label?: string;
};

export function DeleteButton({ action, confirm: confirmMsg, className, iconOnly = true, label = "Eliminar" }: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMsg)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        title={label}
        className={
          className ??
          "inline-flex h-10 w-10 items-center justify-center rounded-md border border-red-200 text-red-500 transition hover:bg-red-50 hover:border-red-300"
        }
      >
        {iconOnly ? <Trash2 className="h-4 w-4" aria-hidden /> : label}
      </button>
    </form>
  );
}
