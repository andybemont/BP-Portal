"use client";

import { ReactNode } from "react";
import { Button } from "./button";

export default function FormModal({
  title,
  formAction,
  children,
  handleClose,
  state,
}: {
  title: string;
  formAction: (state: any) => any;
  children: ReactNode;
  handleClose: () => void;
  state: any;
}) {
  return (
    <form action={formAction}>
      <div className="z-10 fixed inset-0 bg-gray/70 h-screen w-screen flex justify-center overflow-y-auto">
        <div className="p-2 relative border border-black w-full overflow-y-auto shadow-lg rounded-md bg-darkblue max-w-[600px] text-white ">
          <div className="text-center">
            <h3 className="text-2xl font-bold">{title}</h3>
            <div className="m-0 p-0">
              {children}

              <div aria-live="polite" aria-atomic="true">
                {state?.message && state?.errors && (
                  <p className="my-2 text-sm text-warning">{state?.message}</p>
                )}
              </div>
            </div>
            <div className="flex justify-center my-2">
              <Button
                onClick={handleClose}
                className="hover:border-black hover:bg-pop2/70 hover:text-black border-gray bg-white text-gray"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="hover:border-black hover:bg-pop2/70 hover:text-black border-gray bg-white text-gray"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
